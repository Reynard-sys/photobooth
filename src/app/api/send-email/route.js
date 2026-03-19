import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REQUIRED_ENV_VARS = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "SMTP_FROM",
];
const MAX_EMAIL_IMAGE_SIZE = 10 * 1024 * 1024;

function sanitizeFilename(filename, fallbackExtension = "jpg") {
  if (typeof filename !== "string" || !filename.trim()) {
    return `photostrip-${Date.now()}.${fallbackExtension}`;
  }

  const cleaned = filename
    .trim()
    .replace(/[^\w.-]/g, "-")
    .replace(/-+/g, "-");

  return cleaned || `photostrip-${Date.now()}.${fallbackExtension}`;
}

function isUploadedImage(value) {
  return (
    value &&
    typeof value === "object" &&
    typeof value.arrayBuffer === "function" &&
    typeof value.type === "string" &&
    typeof value.size === "number"
  );
}

function buildTransporter() {
  const missingEnvVars = REQUIRED_ENV_VARS.filter(
    (envVar) => !process.env[envVar],
  );

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing email configuration: ${missingEnvVars.join(", ")}`,
    );
  }

  const port = Number(process.env.SMTP_PORT);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("Invalid SMTP_PORT configuration");
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
  });
}

export async function POST(request) {
  let transporter;

  try {
    const formData = await request.formData();
    const emailValue = formData.get("email");
    const imageFile = formData.get("image");
    const filenameValue = formData.get("filename");

    const email =
      typeof emailValue === "string" ? emailValue.trim().toLowerCase() : "";

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address" },
        { status: 400 },
      );
    }

    if (!isUploadedImage(imageFile) || imageFile.size === 0) {
      return NextResponse.json(
        { success: false, error: "Missing image attachment" },
        { status: 400 },
      );
    }

    if (!imageFile.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, error: "Unsupported image format" },
        { status: 400 },
      );
    }

    if (imageFile.size > MAX_EMAIL_IMAGE_SIZE) {
      return NextResponse.json(
        { success: false, error: "Image is too large to email" },
        { status: 400 },
      );
    }

    const attachmentBuffer = Buffer.from(await imageFile.arrayBuffer());
    const extension = imageFile.type.split("/")[1] || "jpg";
    const filename = sanitizeFilename(filenameValue, extension);
    const contentId = `photostrip-${Date.now()}@photobooth.local`;

    transporter = buildTransporter();
    await transporter.verify();

    await transporter.sendMail({
      from: `"Photo Booth 📸" <${process.env.SMTP_FROM}>`,
      to: email,
      subject: "📸 Your Photo Strip is Ready!",
      text: [
        "Thanks for capturing the moment.",
        "Your photo strip is attached to this email.",
      ].join("\n\n"),
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f5f5f5;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background: white;
              }
              .header {
                background: linear-gradient(135deg, #3d568f 0%, #f2aebd 100%);
                color: white;
                padding: 40px 20px;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 28px;
              }
              .content {
                padding: 30px 20px;
                text-align: center;
              }
              .image-container {
                margin: 30px 0;
                background: #fdfdf5;
                padding: 20px;
                border-radius: 10px;
              }
              .image-container img {
                max-width: 100%;
                height: auto;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .footer {
                text-align: center;
                padding: 20px;
                color: #666;
                font-size: 12px;
                background: #f9f9f9;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Your Photo Booth Memory!</h1>
              </div>
              <div class="content">
                <p style="font-size: 18px; color: #3d568f; font-weight: bold;">
                  Thanks for capturing the moment!
                </p>
                <p style="color: #666;">
                  Your photo strip is attached to this email in case your mail
                  app does not render the preview below.
                </p>
                <div class="image-container">
                  <img src="cid:${contentId}" alt="Your Photo Strip" />
                </div>
              </div>
              <div class="footer">
                <p>This email was sent from Photo Booth App</p>
                <p>© ${new Date().getFullYear()} All rights reserved</p>
              </div>
            </div>
          </body>
        </html>
      `,
      attachments: [
        {
          filename,
          content: attachmentBuffer,
          contentType: imageFile.type || "image/jpeg",
          cid: contentId,
          disposition: "inline",
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email send error:", error);

    let errorMessage = "Failed to send email";

    if (error.message?.includes("Missing email configuration")) {
      errorMessage = "Email service is not configured.";
    } else if (error.message?.includes("Invalid SMTP_PORT")) {
      errorMessage = "Email service configuration is invalid.";
    } else if (error.code === "EAUTH") {
      errorMessage = "Email authentication failed.";
    } else if (
      ["ESOCKET", "ETIMEDOUT", "ECONNECTION", "ENOTFOUND"].includes(error.code)
    ) {
      errorMessage = "Cannot connect to email server.";
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  } finally {
    if (typeof transporter?.close === "function") {
      transporter.close();
    }
  }
}
