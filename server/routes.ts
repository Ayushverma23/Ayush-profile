import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: Date;
  ipAddress: string;
}

class ContactStorage {
  private submissions: ContactSubmission[] = [];
  private submissionCounts = new Map<string, { count: number; firstSubmission: number }>();
  private currentId = 1;

  private readonly RATE_LIMIT_WINDOW = 60000;
  private readonly MAX_SUBMISSIONS = 3;

  checkRateLimit(identifier: string): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const userRecord = this.submissionCounts.get(identifier);

    if (!userRecord) {
      this.submissionCounts.set(identifier, { count: 1, firstSubmission: now });
      return { allowed: true, remaining: this.MAX_SUBMISSIONS - 1 };
    }

    if (now - userRecord.firstSubmission >= this.RATE_LIMIT_WINDOW) {
      this.submissionCounts.set(identifier, { count: 1, firstSubmission: now });
      return { allowed: true, remaining: this.MAX_SUBMISSIONS - 1 };
    }

    if (userRecord.count >= this.MAX_SUBMISSIONS) {
      return { allowed: false, remaining: 0 };
    }

    userRecord.count++;
    this.submissionCounts.set(identifier, userRecord);
    return { allowed: true, remaining: this.MAX_SUBMISSIONS - userRecord.count };
  }

  addSubmission(data: Omit<ContactSubmission, "id">): ContactSubmission {
    const submission: ContactSubmission = {
      ...data,
      id: this.currentId++,
    };
    this.submissions.push(submission);
    return submission;
  }

  getSubmissions(): ContactSubmission[] {
    return this.submissions;
  }
}

const contactStorage = new ContactStorage();

async function sendEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  console.log("\n=== EMAIL NOTIFICATION ===");
  console.log("From:", data.name, `<${data.email}>`);
  console.log("Subject:", data.subject);
  console.log("Message:", data.message);
  console.log("Timestamp:", new Date().toISOString());
  console.log("========================\n");

  return { success: true };
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/contact", async (req, res) => {
    try {
      const identifier = req.ip || "unknown";
      
      const rateLimitCheck = contactStorage.checkRateLimit(identifier);
      if (!rateLimitCheck.allowed) {
        return res.status(429).json({
          message: "Too many submissions. Please try again in a minute.",
        });
      }

      const validatedData = contactSchema.parse(req.body);

      const submission = contactStorage.addSubmission({
        ...validatedData,
        timestamp: new Date(),
        ipAddress: identifier,
      });

      const emailResult = await sendEmail(validatedData);

      if (!emailResult.success) {
        console.error("Failed to send email:", emailResult.error);
      }

      res.status(200).json({
        message: "Message received successfully. We'll get back to you soon!",
        submissionId: submission.id,
        remainingSubmissions: rateLimitCheck.remaining,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: error.errors[0].message,
        });
      }

      console.error("Contact form error:", error);
      res.status(500).json({
        message: "Internal server error. Please try again later.",
      });
    }
  });

  app.get("/api/contact/submissions", async (req, res) => {
    const submissions = contactStorage.getSubmissions();
    res.json({
      total: submissions.length,
      submissions: submissions.map(s => ({
        id: s.id,
        name: s.name,
        email: s.email,
        subject: s.subject,
        timestamp: s.timestamp,
      })),
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
