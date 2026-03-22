import { Geist } from "next/font/google";
import "./globals.css";
import RoutePreloader from "../components/routePreloader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Photo Booth",
  description: "Strike a pose and capture the moment!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <RoutePreloader />
        {children}
      </body>
    </html>
  );
}
