import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import ChatWidget from '@/components/ChatWidget';
import { PostHogProvider } from '@/components/PostHogProvider';

export const metadata: Metadata = {
  title: "Audio Anything - Turn Articles into Podcast Audio",
  description: "Convert any article or text into podcast-quality audio. Listen while you work, commute, or exercise.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Audio Anything - Turn Articles into Podcast Audio",
    description: "Convert any article or text into podcast-quality audio. Listen while you work, commute, or exercise.",
    type: "website",
    siteName: "Audio Anything",
  },
  twitter: {
    card: "summary_large_image",
    title: "Audio Anything - Turn Articles into Podcast Audio",
    description: "Convert any article or text into podcast-quality audio. Listen while you work, commute, or exercise.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                try {
                  const saved = localStorage.getItem('darkMode');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const isDark = saved ? saved === 'true' : prefersDark;
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              `,
            }}
          />
        </head>
        <body>
          <PostHogProvider>
            {children}
            <ChatWidget />
          </PostHogProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
