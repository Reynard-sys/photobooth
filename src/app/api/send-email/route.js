import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  try {
    const { email, imageData, filename } = await request.json();

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address", error_code: "invalid_email" },
        { status: 400 },
      );
    }

    console.log("Starting upload to ImgBB...");

    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");

    const formData = new FormData();
    formData.append("image", base64Data);
    formData.append("name", filename);

    // 10-second timeout on ImgBB upload
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    let uploadResult;
    try {
      const uploadResponse = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
          signal: controller.signal,
        },
      );
      uploadResult = await uploadResponse.json();
    } catch (fetchError) {
      clearTimeout(timeoutId);
      const isTimeout = fetchError.name === "AbortError";
      console.error("ImgBB upload failed:", fetchError);
      return NextResponse.json(
        {
          success: false,
          error: isTimeout
            ? "Image upload timed out. Please try again."
            : "Failed to upload image. Please try again.",
          error_code: "imgbb_failed",
        },
        { status: 502 },
      );
    } finally {
      clearTimeout(timeoutId);
    }

    if (!uploadResult.success) {
      console.error("ImgBB returned failure:", uploadResult);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to upload image. Please try again.",
          error_code: "imgbb_failed",
        },
        { status: 502 },
      );
    }

    const imageUrl = uploadResult.data.url;
    console.log("Image uploaded successfully:", imageUrl);
    console.log("Sending email...");

    // Derive secure mode from port: port 465 uses SSL (secure=true), port 587 uses STARTTLS (secure=false)
    const smtpPort = parseInt(process.env.SMTP_PORT || "587");
    const useSecure = smtpPort === 465;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: smtpPort,
      secure: useSecure,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    try {
      await transporter.sendMail({
        from: `"Photo Booth 📸" <${process.env.SMTP_FROM}>`,
        to: email,
        subject: "📸 Your Photo Strip is Ready!",
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
                background: linear-gradient(135deg, #3D568F 0%, #F2AEBD 100%); 
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
                background: #FDFDF5;
                padding: 20px;
                border-radius: 10px;
              }
              .image-container img {
                max-width: 100%;
                height: auto;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              }
              .button { 
                display: inline-block; 
                background: #3D568F; 
                color: white; 
                padding: 15px 40px; 
                text-decoration: none; 
                border-radius: 8px; 
                margin: 20px 0;
                font-weight: bold;
                font-size: 16px;
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
                <h1>🎉 Your Photo Booth Memory!</h1>
              </div>
              
              <div class="content">
                <p style="font-size: 18px; color: #3D568F; font-weight: bold;">
                  Thanks for capturing the moment!
                </p>
                
                <p style="color: #666;">
                  Made by Rey &amp; Rel ദ്ദി◝ ⩊ ◜.ᐟ
                </p>
                
                <div class="image-container">
                  <img src="${imageUrl}" alt="Your Photo Strip" />
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
      });
    } catch (smtpError) {
      console.error("SMTP send failed:", smtpError);
      transporter.close();

      let smtpMessage = "Could not send email. Please check your address and try again.";
      if (smtpError.code === "EAUTH") {
        smtpMessage = "Email authentication failed on our end. Please contact support.";
      } else if (smtpError.code === "ESOCKET" || smtpError.code === "ECONNECTION") {
        smtpMessage = "Could not connect to mail server. Please try again later.";
      }

      return NextResponse.json(
        { success: false, error: smtpMessage, error_code: "smtp_failed" },
        { status: 500 },
      );
    }

    console.log("Email sent successfully!");
    transporter.close();

    return NextResponse.json({
      success: true,
      imageUrl: imageUrl,
    });
  } catch (error) {
    console.error("Unexpected email route error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again.", error_code: "unknown" },
      { status: 500 },
    );
  }
}
