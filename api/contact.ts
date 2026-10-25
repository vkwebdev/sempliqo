import type { VercelRequest, VercelResponse } from "@vercel/node";
import nodemailer from "nodemailer";

// In-memory rate limiting map for serverless execution instance
// Limits IP to max 5 requests per 10 minutes
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  // Clean expired entry
  if (entry && now > entry.resetTime) {
    rateLimitMap.delete(ip);
  }

  const current = rateLimitMap.get(ip);
  if (!current) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (current.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  current.count += 1;
  return false;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function sanitizeInput(val: unknown, maxLength = 500): string {
  if (typeof val !== "string") return "";
  // Strip control characters while preserving newlines
  const cleaned = val.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim();
  return cleaned.slice(0, maxLength);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  // Rate Limiting by client IP
  const clientIp =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    (req.headers["x-real-ip"] as string) ||
    req.socket?.remoteAddress ||
    "unknown";

  if (isRateLimited(clientIp)) {
    return res.status(429).json({
      success: false,
      message: "Too many requests. Please wait a few minutes before trying again.",
    });
  }

  const body = req.body || {};

  // Honeypot anti-spam check: if "website" field has any value, silently reject
  if (body.website && typeof body.website === "string" && body.website.trim().length > 0) {
    // Return 200 so bots think submission was successful without sending an email
    return res.status(200).json({
      success: true,
      message: "Thanks for contacting Sempliqo. We'll get back to you shortly.",
    });
  }

  // Sanitize and extract form fields matching EnquiryForm
  const name = sanitizeInput(body.name, 100);
  const email = sanitizeInput(body.email, 150).toLowerCase();
  const phone = sanitizeInput(body.phone, 50);
  const company = sanitizeInput(body.company, 150);
  const projectType = sanitizeInput(body.projectType, 100);
  const services = sanitizeInput(body.services, 150);
  const description = sanitizeInput(body.description, 5000);
  const stage = sanitizeInput(body.stage, 100);
  const timeline = sanitizeInput(body.timeline, 100);
  const budget = sanitizeInput(body.budget, 100);
  const contactMethod = sanitizeInput(body.contactMethod, 50);
  const consent = body.consent;

  // Validation
  const errors: string[] = [];

  if (!name || name.length < 2) errors.push("Valid name is required.");
  
  // RFC 5322 compliant simplified email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!email || !emailRegex.test(email)) errors.push("Valid work email is required.");

  if (!company || company.length < 2) errors.push("Company name is required.");
  if (!projectType) errors.push("Project type is required.");
  if (!services) errors.push("Service selection is required.");
  if (!description || description.length < 30) errors.push("Description must be at least 30 characters.");
  if (!stage) errors.push("Project stage is required.");
  if (!timeline) errors.push("Timeline is required.");
  if (!budget) errors.push("Budget is required.");
  if (!contactMethod) errors.push("Contact method is required.");
  if (consent !== true) errors.push("Consent is required.");

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid form data. Please check all required fields.",
    });
  }

  // Environment variables verification
  const host = process.env.SMTP_HOST || "smtppro.zoho.com";
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const user = process.env.SMTP_USER || "contact@sempliqo.tech";
  const pass = process.env.SMTP_PASSWORD;

  if (!pass) {
    console.error("Server misconfiguration: SMTP_PASSWORD environment variable is missing.");
    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending your message. Please try again.",
    });
  }

  // Create Nodemailer Transporter
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    // Strict timeout settings to avoid hanging Vercel serverless executions
    connectionTimeout: 10000,
    greetingTimeout: 5000,
    socketTimeout: 15000,
  });

  const submissionTime = new Date().toUTCString();

  // Plain Text Version
  const textContent = `New Contact Form Submission — Sempliqo
=========================================

Contact Information:
- Name: ${name}
- Email: ${email}
- Phone: ${phone || "Not provided"}
- Company: ${company}
- Preferred Contact Method: ${contactMethod}

Project Details:
- Project Type: ${projectType}
- Services Needed: ${services}
- Current Stage: ${stage}
- Desired Timeline: ${timeline}
- Indicative Budget: ${budget}

Project Description:
${description}

-----------------------------------------
Website: sempliqo.tech
Submission Time: ${submissionTime}
Consent: Granted
`;

  // HTML Version
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6; margin: 0; padding: 20px; background-color: #f8fafc; }
    .card { max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .header { background: #07182e; color: #ffffff; padding: 24px; text-align: left; }
    .header h2 { margin: 0; font-size: 20px; font-weight: 600; letter-spacing: -0.02em; }
    .header p { margin: 4px 0 0 0; color: #94a3b8; font-size: 13px; }
    .content { padding: 24px; }
    .section-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #0878f9; margin-top: 20px; margin-bottom: 10px; border-bottom: 1px solid #f1f5f9; padding-bottom: 4px; }
    .section-title:first-of-type { margin-top: 0; }
    .field-row { display: flex; margin-bottom: 10px; font-size: 14px; }
    .field-label { width: 180px; font-weight: 600; color: #64748b; flex-shrink: 0; }
    .field-val { color: #0f172a; word-break: break-word; }
    .desc-box { background: #f8fafc; border-left: 3px solid #0878f9; padding: 12px 16px; border-radius: 4px; font-size: 14px; color: #334155; white-space: pre-wrap; margin-top: 8px; }
    .footer { background: #f1f5f9; padding: 16px 24px; font-size: 12px; color: #64748b; text-align: left; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2>New Contact Form Submission</h2>
      <p>Received via sempliqo.tech contact enquiry form</p>
    </div>
    <div class="content">
      <div class="section-title">Contact Information</div>
      <div class="field-row"><span class="field-label">Name:</span><span class="field-val"><strong>${escapeHtml(name)}</strong></span></div>
      <div class="field-row"><span class="field-label">Work Email:</span><span class="field-val"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></span></div>
      <div class="field-row"><span class="field-label">Phone / WhatsApp:</span><span class="field-val">${escapeHtml(phone || "Not provided")}</span></div>
      <div class="field-row"><span class="field-label">Company:</span><span class="field-val">${escapeHtml(company)}</span></div>
      <div class="field-row"><span class="field-label">Preferred Method:</span><span class="field-val">${escapeHtml(contactMethod)}</span></div>

      <div class="section-title">Project Scope</div>
      <div class="field-row"><span class="field-label">Project Type:</span><span class="field-val">${escapeHtml(projectType)}</span></div>
      <div class="field-row"><span class="field-label">Services Needed:</span><span class="field-val">${escapeHtml(services)}</span></div>
      <div class="field-row"><span class="field-label">Project Stage:</span><span class="field-val">${escapeHtml(stage)}</span></div>
      <div class="field-row"><span class="field-label">Desired Timeline:</span><span class="field-val">${escapeHtml(timeline)}</span></div>
      <div class="field-row"><span class="field-label">Indicative Budget:</span><span class="field-val">${escapeHtml(budget)}</span></div>

      <div class="section-title">Project Description</div>
      <div class="desc-box">${escapeHtml(description)}</div>
    </div>
    <div class="footer">
      <strong>Website:</strong> sempliqo.tech &bull; <strong>Submission Time:</strong> ${submissionTime} &bull; <strong>Consent:</strong> Confirmed
    </div>
  </div>
</body>
</html>
`;

  try {
    await transporter.sendMail({
      from: `"Sempliqo Website" <${user}>`,
      to: user,
      replyTo: email,
      subject: "New Contact Form Submission — Sempliqo",
      text: textContent,
      html: htmlContent,
    });

    return res.status(200).json({
      success: true,
      message: "Thanks for contacting Sempliqo. We'll get back to you shortly.",
    });
  } catch (error) {
    // Log internally for Vercel Functions logs, but never expose to client
    console.error("Nodemailer transmission failed:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending your message. Please try again.",
    });
  }
}
