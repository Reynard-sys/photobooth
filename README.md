# Photo Booth

[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/Reynard-sys/photobooth)

A fun, web-based photo booth application built with Next.js and Tailwind CSS. Capture moments, customize them with unique templates and filters, and instantly download or email your photo strips. This project is fully responsive and designed for a seamless experience on both desktop and mobile devices.

## Features

-   **Responsive Design**: A beautiful and functional interface that adapts to any screen size.
-   **Live Camera Preview**: See yourself before the photo is taken.
-   **Camera Switching**: Easily switch between front and back cameras on mobile devices.
-   **Customizable Sessions**:
    -   Choose between a 3, 5, or 10-second timer.
    -   Select either 3 or 4 shots per session.
-   **Review and Retake**: Not happy with a shot? You can retake any individual photo before finalizing.
-   **Creative Customization**:
    -   **14 Photo Strip Templates**: Choose from a wide variety of themed frames.
    -   **6 Instagram-like Filters**: Apply filters like Aden, Inkwell, Crema, and more to your photos.
-   **Instant Download**: Save your final photo strip as a high-quality PNG image.
-   **Email Your Photos**: Send the generated photo strip directly to your email address.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Image Generation**: [html2canvas](https://html2canvas.hertzen.com/) to convert styled DOM elements into a canvas image.
-   **Emailing**: [Nodemailer](https://nodemailer.com/) for sending emails via an API route.
-   **Image Hosting**: [ImgBB API](https://api.imgbb.com/) for temporarily hosting images to be included in emails.

## Getting Started

### Prerequisites

-   Node.js (v18 or later)
-   npm, yarn, or pnpm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/reynard-sys/photobooth.git
    cd photobooth
    ```

2.  Install the dependencies:
    ```bash
    npm install
    ```

### Environment Variables

The application requires several environment variables for the email functionality to work. create a `.env.local` file in the root of the project and add the following variables:

```
# ImgBB API Key for image uploads
# Get a free key from https://api.imgbb.com/
IMGBB_API_KEY=your_imgbb_api_key

# SMTP Server credentials for sending emails
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
SMTP_FROM=your_sender_email_address
```

### Running the Development Server

Once the dependencies are installed and the environment variables are set, you can run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

-   `src/app/`: Contains the main pages and routes for the application.
    -   `page.js`: The landing page.
    -   `select/page.js`: Page for selecting timer and number of shots.
    -   `capture/page.js`: The main camera interface for taking photos.
    -   `check/page.js`: Page for reviewing and retaking photos.
    -   `edit/page.js`: Interface for selecting photo strip templates and filters.
    -   `download/page.js`: Final page for downloading or emailing the photo strip.
    -   `api/send-email/route.js`: API endpoint for handling image upload and email sending.
-   `src/components/`: Reusable React components used across various pages (e.g., `camera.jsx`, `filterSelect.jsx`, `photostrip3.jsx`).
-   `public/`: Static assets including images, icons, and photo strip templates.
-   `tailwind.config.js`: Configuration file for Tailwind CSS.

## How It Works

1.  **Selection**: The user starts by selecting the countdown timer and the number of photos for their strip.
2.  **Capture**: The app accesses the device's camera. A countdown timer appears before each shot is automatically taken.
3.  **Review**: After the session, all captured photos are displayed. The user can choose to retake any specific photo.
4.  **Edit**: The user proceeds to an editing screen where they can select a decorative photo strip template and apply a visual filter. A live preview of the final strip is shown.
5.  **Finalize**: The final page displays the photo strip emerging from a virtual machine.
    -   **Download**: The user can download the final image. `html2canvas` is used to capture the styled DOM elements of the photo strip and convert it into a PNG.
    -   **Email**: The user can enter their email address. The generated image is first uploaded to ImgBB to get a public URL, and then an API route uses Nodemailer to send an HTML email containing the photo strip.

## Deployment

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new).

Remember to add your environment variables to the Vercel project settings to ensure the email functionality works in production.

## Credits

Made by **Rey & Rel** ദ്ദി◝ ⩊ ◜.ᐟ