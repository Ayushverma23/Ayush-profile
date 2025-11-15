// Vercel serverless function for contact form
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

// Initialize Resend client
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// In-memory storage for rate limiting (resets on each function invocation, but that's okay for serverless)
const submissionCounts = new Map<string, { count: number; firstSubmission: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_SUBMISSIONS = 3;

function checkRateLimit(identifier: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const userRecord = submissionCounts.get(identifier);

  if (!userRecord) {
    submissionCounts.set(identifier, { count: 1, firstSubmission: now });
    return { allowed: true, remaining: MAX_SUBMISSIONS - 1 };
  }

  if (now - userRecord.firstSubmission >= RATE_LIMIT_WINDOW) {
    submissionCounts.set(identifier, { count: 1, firstSubmission: now });
    return { allowed: true, remaining: MAX_SUBMISSIONS - 1 };
  }

  if (userRecord.count >= MAX_SUBMISSIONS) {
    return { allowed: false, remaining: 0 };
  }

  userRecord.count++;
  submissionCounts.set(identifier, userRecord);
  return { allowed: true, remaining: MAX_SUBMISSIONS - userRecord.count };
}

async function sendEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  const recipientEmail = process.env.CONTACT_EMAIL || "luckyverma.ara2005@gmail.com";

  if (!resend || !process.env.RESEND_API_KEY) {
    console.log("\n=== EMAIL NOTIFICATION (Resend not configured) ===");
    console.log("To:", recipientEmail);
    console.log("From:", data.name, `<${data.email}>`);
    console.log("Subject:", data.subject);
    console.log("Message:", data.message);
    console.log("Timestamp:", new Date().toISOString());
    console.log("========================\n");
    return { success: true };
  }

  try {
    const { data: emailData, error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: [recipientEmail],
      replyTo: data.email,
      subject: `Portfolio Contact: ${data.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #06b6d4; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            <p><strong>Subject:</strong> ${data.subject}</p>
            <p><strong>Message:</strong></p>
            <p style="background: white; padding: 15px; border-left: 4px solid #06b6d4; margin-top: 10px;">
              ${data.message.replace(/\n/g, "<br>")}
            </p>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            Timestamp: ${new Date().toLocaleString()}
          </p>
        </div>
      `,
      text: `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject}

Message:
${data.message}

Timestamp: ${new Date().toLocaleString()}
      `,
    });

    if (error) {
      console.error("Resend API error:", error);
      return { success: false, error: error.message };
    }

    console.log("✅ Email sent successfully via Resend:", emailData?.id);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to send email:", errorMessage);
    return { success: false, error: errorMessage };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Get client IP for rate limiting
    const identifier = 
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      (req.headers["x-real-ip"] as string) ||
      req.socket?.remoteAddress ||
      "unknown";

    // Check rate limit
    const rateLimitCheck = checkRateLimit(identifier);
    if (!rateLimitCheck.allowed) {
      return res.status(429).json({
        message: "Too many submissions. Please try again in a minute.",
      });
    }

    // Validate request body
    const validatedData = contactSchema.parse(req.body);

    // Send email
    const emailResult = await sendEmail(validatedData);

    if (!emailResult.success) {
      console.error("Failed to send email:", emailResult.error);
      // Still return success to user, but log the error
    }

    return res.status(200).json({
      message: "Message received successfully. We'll get back to you soon!",
      remainingSubmissions: rateLimitCheck.remaining,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: error.errors[0].message,
      });
    }

    console.error("Contact form error:", error);
    return res.status(500).json({
      message: "Internal server error. Please try again later.",
    });
  }
}

