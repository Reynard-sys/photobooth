# Photo Booth

A fun, interactive web-based photo booth application built with **Next.js** and **Tailwind CSS**. Capture moments, customize them with unique templates and filters, and instantly download or email your photo strips. This project is fully responsive and designed for a seamless experience on both desktop and mobile devices.

## About This Project

Photo Booth is a full-stack web application that brings the joy of traditional photo booths to your browser. Whether you're at a party, event, or just having fun, this app lets you create shareable photo strips with creative filters and templates. It's perfect for events, social gatherings, or simply capturing fun moments with friends.

## Features

- **📸 Live Camera Capture**: Real-time camera preview with automatic photo capture
- **🔄 Camera Switching**: Toggle between front and back cameras on mobile devices
- **⏱️ Flexible Sessions**: Choose your countdown timer (3s, 5s, or 10s) and photo count (3 or 4 shots)
- **✏️ Review & Retake**: Retake individual photos if you're not happy with them
- **🎨 Creative Customization**:
  - **14 Photo Strip Templates**: Choose from a wide variety of themed frames (Stardew Valley, Cat-themed, Valentine's, and more)
  - **6 Instagram-like Filters**: Aden, Ado, Crema, Inkwell, Perpetua, Sutro, and more
- **⬇️ Instant Download**: Save your final photo strip as a high-quality PNG image
- **📧 Email Photos**: Send your photo strip directly to your email address with a single click
- **📱 Fully Responsive**: Beautiful interface that works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) 16 with React 19 and App Router
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with PostCSS
- **Image Processing**: [html2canvas](https://html2canvas.hertzen.com/) for DOM-to-image conversion, [Sharp](https://sharp.pixelplumbing.com/) for image optimization
- **Email Service**: [Nodemailer](https://nodemailer.com/) for SMTP-based email delivery
- **Image Hosting**: [ImgBB API](https://api.imgbb.com/) for temporary image hosting in emails
- **Development**: ESLint for code quality

## Getting Started

### Prerequisites

- **Node.js** 18 or later
- **npm**, **yarn**, or **pnpm** package manager
- A modern web browser with Camera API support (Chrome, Firefox, Safari, Edge)
- (Optional) SMTP credentials for email functionality (Gmail, Outlook, SendGrid, etc.)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/reynard-sys/photobooth.git
   cd photobooth
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Configure environment variables** (optional, required for email feature):
   
   Create a `.env.local` file in the root directory:
   ```env
   # ImgBB API Key for image uploads (get free from https://api.imgbb.com/)
   IMGBB_API_KEY=your_imgbb_api_key_here

   # SMTP Server configuration for email sending
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@example.com
   SMTP_PASS=your_app_password
   SMTP_FROM=noreply@example.com
   ```

   **Email Setup Guide**:
   - **Gmail**: [Use App Password](https://support.google.com/accounts/answer/185833)
   - **Outlook**: Use your app password or SMTP credentials from account settings
   - **SendGrid**: Use `apikey` as username and your API key as password

4. **Run the development server**:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build for Production

```bash
npm run build
npm start
```

## Usage

### Quick Start Flow

1. **Start**: Click the start button on the landing page
2. **Configure**: Select your timer duration (3s, 5s, or 10s) and number of shots (3 or 4)
3. **Capture**: Allow camera access and wait for the countdown to capture your shots
4. **Review**: Check your photos and retake any that you're not happy with
5. **Customize**: Choose a photo strip template and apply color filters
6. **Finalize**: Download as PNG or enter your email to get it sent

### Camera Access

The app requires camera permissions. When you first visit:
- You'll see a browser permission request to access your camera
- Click "Allow" to grant permission
- For mobile devices, you can switch between front and back cameras using the camera toggle button

### Tips for Best Results

- **Lighting**: Use natural light or well-lit environments
- **Framing**: Position yourself in the center of the camera view
- **Multiple Takes**: Use the retake feature to get the perfect shot
- **Filters**: Experiment with different filters for creative effects
- **Templates**: Choose templates that match your theme or aesthetic

## Project Structure

```
photobooth/
├── src/
│   ├── app/
│   │   ├── page.js              # Landing page
│   │   ├── layout.js            # Root layout wrapper
│   │   ├── globals.css          # Global styles
│   │   ├── select/page.js       # Timer & shot count selection
│   │   ├── capture/page.js      # Camera capture interface
│   │   ├── check/page.js        # Photo review & retake
│   │   ├── edit/page.js         # Filter & template selection
│   │   ├── download/page.js     # Download or email final strip
│   │   ├── retake/page.js       # Retake individual photos
│   │   └── api/
│   │       └── send-email/route.js  # Email API endpoint
│   └── components/
│       ├── camera.jsx           # Main camera component
│       ├── retakeCamera.jsx     # Camera for single photo retake
│       ├── photostrip3.jsx      # 3-photo strip layout
│       ├── photostrip4.jsx      # 4-photo strip layout
│       ├── filterSelect.jsx     # Filter selection UI
│       ├── stripSelect.jsx      # Template selection UI
│       ├── timerSelect.jsx      # Timer duration selector
│       ├── shotSelect.jsx       # Shot count selector
│       └── border.jsx           # Decorative border component
├── public/
│   ├── strips/
│   │   ├── 3photos/            # 3-photo strip templates
│   │   └── 4photos/            # 4-photo strip templates
│   └── [various .png assets]   # Filter previews, UI icons
├── next.config.mjs             # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.mjs          # PostCSS configuration
├── eslint.config.mjs           # ESLint configuration
├── jsconfig.json               # JavaScript compiler options
├── package.json                # Dependencies & scripts
└── README.md                   # This file
```

### Key Directories

- **`src/app/`**: Next.js App Router pages. Each folder represents a route in the application
- **`src/components/`**: Reusable React components shared across pages
- **`public/strips/`**: Photo strip template SVG/image assets for 3 and 4 photo layouts
- **`public/`**: All static assets including filter previews and UI graphics

## How It Works

The application flow guides users through a seamless photo booth experience:

### Step-by-Step Process

1. **Landing Page** (`/`)
   - User-friendly welcome screen with theme-appropriate imagery
   - Clear call-to-action button to begin

2. **Configuration** (`/select`)
   - User selects countdown timer: 3 seconds, 5 seconds, or 10 seconds
   - User selects number of shots: 3 or 4 photos per strip
   - Choices are saved in session state

3. **Live Capture** (`/capture`)
   - App requests camera access from the browser
   - Real-time video feed shown from selected camera
   - Multiple shots captured automatically at configured intervals
   - Countdown timer displayed before each shot

4. **Review & Retake** (`/check`)
   - All captured photos displayed in grid
   - User can review each photo
   - Option to retake any individual photo (returns to `/retake` for that specific shot)
   - Once satisfied, proceed to customization

5. **Customization** (`/edit`)
   - Browse 14+ photo strip templates
   - Apply Instagram-style filters to all photos
   - Live preview shows exact final output
   - Choose and confirm selections

6. **Finalization** (`/download`)
   - Final photo strip displayed animated from vintage-style photo machine
   - Option to **Download**: 
     - Uses `html2canvas` to render the styled DOM as a canvas
     - Exports as high-quality PNG image
     - Direct browser download
   - Option to **Email**:
     - User enters email address
     - Photos uploaded to ImgBB for hosting
     - HTML email composed with styled photo strip
     - Sent via Nodemailer using configured SMTP server

### Technology Details

- **Camera Access**: Uses Web Cameras API for accessing device cameras
- **Image Rendering**: `html2canvas` converts styled React components to canvas, then PNG
- **Email Pipeline**: 
  1. Image encoded to Base64
  2. Uploaded to ImgBB external service
  3. ImgBB returns public URL
  4. Nodemailer sends HTML email with embedded image URL
- **State Management**: React hooks and URL parameters for maintaining user selections across pages

## Deployment

This Next.js application can be deployed to several platforms:

### Vercel (Recommended)

Vercel is the official Next.js deployment platform and offers the smoothest experience:

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/new)
3. Import your GitHub repository
4. Add environment variables in project settings:
   - `IMGBB_API_KEY`
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
5. Deploy with one click

### Other Platforms

The application can also be deployed to:
- **AWS Amplify**: Static export with API functions
- **Netlify**: With Next.js adapter
- **Docker**: Standard Node.js containerization
- **Self-hosted**: Any Node.js hosting provider

## Troubleshooting

### Camera Not Accessing
- Ensure your browser has permission to access the camera
- Check browser privacy/security settings: Settings → Privacy → Camera
- Try a different browser (Chrome, Firefox, Safari)
- For HTTPS: most browsers require HTTPS for camera API (except localhost)

### Email Not Sending
- Verify SMTP credentials are correct
- Check firewall doesn't block SMTP port (usually 587 or 465)
- For Gmail: Use **App Password** (not your regular password)
- Check email spam/junk folder
- Review browser console for error messages (F12 → Console)

### Images Not Rendering
- Check browser console for CORS errors
- Verify ImgBB API key is valid
- Ensure sufficient disk space for image processing
- Clear browser cache and try again

## Getting Help

### Documentation
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Tailwind CSS**: [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **html2canvas**: [html2canvas.hertzen.com](https://html2canvas.hertzen.com/)
- **Nodemailer**: [nodemailer.com](https://nodemailer.com/)

### Support Resources
- **Issues**: Report bugs or request features by [opening an issue](https://github.com/reynard-sys/photobooth/issues)
- **Discussions**: Ask questions in [GitHub Discussions](https://github.com/reynard-sys/photobooth/discussions)
- **Deep Wiki**: [Ask on DeepWiki](https://deepwiki.com/Reynard-sys/photobooth)

## Contributing

Contributions are welcome! To contribute:

1. **Fork** the repository
2. **Create a feature branch**: `git checkout -b feature/YourFeature`
3. **Make your changes** and test thoroughly
4. **Commit** your changes: `git commit -m 'Add YourFeature'`
5. **Push** to your fork: `git push origin feature/YourFeature`
6. **Submit a Pull Request** with a clear description of changes

### Areas for Contribution
- Additional photo strip templates
- New filter styles
- Performance optimization
- Mobile experience improvements
- Accessibility enhancements
- Bug fixes and testing
- Documentation improvements

Please ensure your code follows the existing style and lint cleanly:

```bash
npm run lint
```

## License

This project is open source and available under the [MIT License](LICENSE).

## Credits

**Made with ❤️ by Rey & Rel** 

Photo Booth was created to bring joy and creativity to event photography and social gatherings. Special thanks to all the open-source projects that made this possible:

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [html2canvas](https://html2canvas.hertzen.com/) for DOM rendering
- [Nodemailer](https://nodemailer.com/) for email delivery
- [ImgBB](https://api.imgbb.com/) for image hosting

---

**Questions or feedback?** [Start a discussion](https://github.com/reynard-sys/photobooth/discussions) or check out our other projects!