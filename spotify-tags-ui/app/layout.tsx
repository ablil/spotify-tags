import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "react-contexify/dist/ReactContexify.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, Zoom } from "react-toastify";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Spotify tags",
  description: "Spotify tags",
  robots: "noindex, nofollow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <ToastContainer
          position="top-center"
          hideProgressBar={true}
          closeOnClick={true}
          theme="dark"
          transition={Zoom}
          limit={1}
        />
      </body>
    </html>
  );
}
