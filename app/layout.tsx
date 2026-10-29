import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BroadcastBanner from "@/components/layout/BroadcastBanner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ECUSTA Student Council",
    template: "%s · ECUSTA Student Council",
  },
  description:
    "Official Student Council of the East Central University of Science, Technology, and Allied Health. Representing the student body of ECUSTA's School of Medicine.",
  keywords: ["ECUSTA", "Student Council", "ECUSTA SC", "ECUSTA Atlas", "student government", "Ethiopia medical university"],
  openGraph: {
    siteName: "ECUSTA Student Council",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Theme detection — runs before first paint to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased min-h-full flex flex-col bg-[#FAF8F5] dark:bg-[#0A0A0A] text-foreground relative transition-colors duration-300">
        <BroadcastBanner />
        <Navbar />
        <main className="flex-1 relative z-0">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
