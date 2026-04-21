import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "The Pickleball Helpline",
  description: "Get your pickleball game reviewed by Coach AJ. 45-minute video call, personalized action plan, and drills to improve fast.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${montserrat.className} min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
