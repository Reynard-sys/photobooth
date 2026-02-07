import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { email, imageData, filename } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Invalid email address" },
        { status: 400 },
      );
    }

    console.log("Starting upload to ImgBB...");

    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");

    const formData = new FormData();
    formData.append("image", base64Data);
    formData.append("name", filename);

    const uploadResponse = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
      {
        method: "POST",
        body: formData,
      },
    );

    const uploadResult = await uploadResponse.json();

    if (!uploadResult.success) {
      throw new Error("Failed to upload image");
    }

    const imageUrl = uploadResult.data.url;
    const displayUrl = uploadResult.data.display_url;

    console.log("Image uploaded successfully:", imageUrl);
    console.log("Sending email...");

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

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
              .button:hover {
                background: #2d4470;
              }
              .footer {
                text-align: center;
                padding: 20px;
                color: #666;
                font-size: 12px;
                background: #f9f9f9;
              }
              .tip {
                background: #fff9e6;
                border-left: 4px solid #F2AEBD;
                padding: 15px;
                margin: 20px 0;
                text-align: left;
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
                  Made by Rey & Rel ദ്ദി◝ ⩊ ◜.ᐟ
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

    console.log("Email sent successfully!");
    transporter.close();

    return NextResponse.json({
      success: true,
      imageUrl: imageUrl,
    });
  } catch (error) {
    console.error("Email send error:", error);

    let errorMessage = "Failed to send email";

    if (error.message.includes("upload")) {
      errorMessage = "Failed to upload image. Please try again.";
    } else if (error.code === "EAUTH") {
      errorMessage = "Email authentication failed.";
    } else if (error.code === "ESOCKET") {
      errorMessage = "Cannot connect to email server.";
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
