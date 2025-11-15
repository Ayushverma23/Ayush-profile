import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Send, Mail, Github, Linkedin, CheckCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function ShootingStar({ delay }: { delay: number }) {
  return (
    <motion.div
      className="absolute w-1 h-1 bg-cyan-400 rounded-full"
      initial={{ x: "0%", y: "0%", opacity: 0 }}
      animate={{
        x: ["0%", "100%"],
        y: ["0%", "50%"],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: 2,
        delay,
        repeat: Infinity,
        repeatDelay: 5,
      }}
      style={{
        boxShadow: "0 0 10px #06b6d4, 0 0 20px #06b6d4",
      }}
    />
  );
}

function ParticleField() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-purple-400 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3,
            delay: particle.delay,
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  );
}

const socialLinks = [
  {
    name: "GitHub",
    icon: Github,
    url: "https://github.com/Ayushverma23",
    color: "#333",
    angle: 0,
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    url: "https://www.linkedin.com/in/ayush-verma92/",
    color: "#0077B5",
    angle: 120,
  },
  {
    name: "Email",
    icon: Mail,
    url: "mailto:luckyverma92@gmail.com",
    color: "#EA4335",
    angle: 240,
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        const error = await response.json();
        setErrors({ submit: error.message || "Failed to send message" });
      }
    } catch (error) {
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="relative w-full min-h-screen flex items-center justify-center py-20 px-4 overflow-hidden"
    >
      <ParticleField />
      <ShootingStar delay={0} />
      <ShootingStar delay={2} />
      <ShootingStar delay={4} />

      <div className="absolute inset-0 opacity-20">
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-600 rounded-full filter blur-[128px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full filter blur-[128px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>

      <div className="max-w-4xl w-full mx-auto z-10">
        <motion.h2
          className="text-5xl md:text-6xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          Get In Touch
        </motion.h2>

        <motion.p
          className="text-center text-gray-400 mb-12 text-lg"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Let's create something amazing together
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {socialLinks.map((social, index) => {
            const Icon = social.icon;
            return (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card rounded-xl p-6 flex flex-col items-center gap-3 hover:scale-105 transition-transform"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                whileHover={{
                  boxShadow: `0 0 30px ${social.color}40`,
                  borderColor: social.color,
                }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: `${social.color}20`,
                    border: `2px solid ${social.color}40`,
                  }}
                >
                  <Icon className="w-8 h-8" style={{ color: social.color }} />
                </div>
                <span className="font-semibold text-white">{social.name}</span>
              </motion.a>
            );
          })}
        </div>

        <motion.div
          className="glass-card rounded-2xl p-8 relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{
            boxShadow: "0 0 40px rgba(6, 182, 212, 0.2), 0 0 80px rgba(139, 92, 246, 0.1)",
          }}
        >
          <div className="absolute inset-0 opacity-20">
            <motion.div
              className="absolute inset-0 border-2 rounded-2xl"
              style={{
                borderImage: "linear-gradient(45deg, #06b6d4, #8b5cf6, #db2777) 1",
              }}
              animate={{
                borderImage: [
                  "linear-gradient(0deg, #06b6d4, #8b5cf6, #db2777) 1",
                  "linear-gradient(360deg, #06b6d4, #8b5cf6, #db2777) 1",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative">
                <motion.div
                  animate={focusedField === "name" ? { scale: 1.02 } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Input
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    className={`bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:ring-cyan-400/50 ${
                      errors.name ? "border-red-500" : ""
                    }`}
                  />
                </motion.div>
                {errors.name && (
                  <motion.p
                    className="text-red-400 text-sm mt-1"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.name}
                  </motion.p>
                )}
              </div>

              <div className="relative">
                <motion.div
                  animate={focusedField === "email" ? { scale: 1.02 } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Input
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    className={`bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:ring-cyan-400/50 ${
                      errors.email ? "border-red-500" : ""
                    }`}
                  />
                </motion.div>
                {errors.email && (
                  <motion.p
                    className="text-red-400 text-sm mt-1"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.email}
                  </motion.p>
                )}
              </div>
            </div>

            <div className="relative">
              <motion.div
                animate={focusedField === "subject" ? { scale: 1.02 } : { scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Input
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  onFocus={() => setFocusedField("subject")}
                  onBlur={() => setFocusedField(null)}
                  className={`bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:ring-cyan-400/50 ${
                    errors.subject ? "border-red-500" : ""
                  }`}
                />
              </motion.div>
              {errors.subject && (
                <motion.p
                  className="text-red-400 text-sm mt-1"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.subject}
                </motion.p>
              )}
            </div>

            <div className="relative">
              <motion.div
                animate={focusedField === "message" ? { scale: 1.02 } : { scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Textarea
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  onFocus={() => setFocusedField("message")}
                  onBlur={() => setFocusedField(null)}
                  rows={6}
                  className={`bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:ring-cyan-400/50 resize-none ${
                    errors.message ? "border-red-500" : ""
                  }`}
                />
              </motion.div>
              {errors.message && (
                <motion.p
                  className="text-red-400 text-sm mt-1"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.message}
                </motion.p>
              )}
            </div>

            {errors.submit && (
              <motion.p
                className="text-red-400 text-sm text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {errors.submit}
              </motion.p>
            )}

            {submitSuccess && (
              <motion.div
                className="flex items-center justify-center gap-2 text-green-400"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <CheckCircle className="w-5 h-5" />
                <span>Message sent successfully!</span>
              </motion.div>
            )}

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-semibold py-6 rounded-full text-lg hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
