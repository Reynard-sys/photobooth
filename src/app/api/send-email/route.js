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
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Your Photo Strip</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body {
                font-family: 'Georgia', serif;
                background-color: #f5f0eb;
                color: #3d3d3d;
              }
              .wrapper {
                max-width: 560px;
                margin: 40px auto;
                background: #fdfdf5;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 4px 24px rgba(0,0,0,0.10);
                border: 1.5px solid #e8ddd5;
              }
              .header {
                background: linear-gradient(135deg, #3d568f 0%, #7b84c3 60%, #f2aebd 100%);
                padding: 40px 30px 32px;
                text-align: center;
              }
              .header .emoji {
                font-size: 42px;
                display: block;
                margin-bottom: 10px;
              }
              .header h1 {
                font-family: 'Georgia', serif;
                font-size: 26px;
                color: #ffffff;
                font-weight: normal;
                letter-spacing: 0.5px;
                text-shadow: 0 1px 4px rgba(0,0,0,0.18);
              }
              .tagline {
                font-size: 13px;
                color: rgba(255,255,255,0.80);
                margin-top: 6px;
                letter-spacing: 0.3px;
              }
              .content {
                padding: 32px 30px 20px;
                text-align: center;
              }
              .greeting {
                font-size: 17px;
                color: #3d568f;
                font-weight: bold;
                margin-bottom: 8px;
              }
              .subtext {
                font-size: 13.5px;
                color: #888;
                line-height: 1.6;
                margin-bottom: 28px;
              }
              .photo-frame {
                background: #fff;
                border: 1.5px solid #e8ddd5;
                border-radius: 12px;
                padding: 16px;
                display: inline-block;
                box-shadow: 0 2px 12px rgba(61,86,143,0.08);
                margin-bottom: 28px;
              }
              .photo-frame img {
                display: block;
                max-width: 100%;
                height: auto;
                border-radius: 6px;
              }
              .divider {
                border: none;
                border-top: 1px solid #ede8e0;
                margin: 0 30px;
              }
              .footer {
                padding: 22px 30px;
                text-align: center;
                background: #fdfdf5;
              }
              .footer .credit {
                font-size: 13px;
                color: #3d568f;
                font-weight: bold;
                margin-bottom: 4px;
              }
              .footer .note {
                font-size: 11.5px;
                color: #aaa;
              }
            </style>
          </head>
          <body>
            <div class="wrapper">
              <div class="header">
                <span class="emoji">📸</span>
                <h1>Your Photo Booth Memory!</h1>
                <p class="tagline">A little keepsake, just for you ✨</p>
              </div>

              <div class="content">
                <p class="greeting">Thanks for capturing the moment!</p>
                <p class="subtext">
                  Your photo strip is below — and also attached to this email<br />
                  in case your mail app doesn't render the preview.
                </p>
                <div class="photo-frame">
                  <img src="cid:${contentId}" alt="Your Photo Strip" />
                </div>
              </div>

              <hr class="divider" />

              <div class="footer">
                <p class="credit">Made by Rey &amp; Rel ദ്ദി◝ ⩊ ◜.ᐟ</p>
                <p class="note">© ${new Date().getFullYear()} — Hope you had a great time! 🎉</p>
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
