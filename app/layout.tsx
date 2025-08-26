import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ConvexClientProvider } from "@/components/providers/convex-provider";

const geist = Geist({ 
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-geist"
});

export const metadata: Metadata = {
  title: "Nova - Real-Time Collaboration IDE",
  description: "A modern development environment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={geist.className}>
        <ConvexClientProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="comp-ide-theme"
        >
          <Toaster 
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'var(--background)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
                borderRadius: '0px',
                fontFamily: 'var(--font-geist)',
                fontWeight: '300',
                fontSize: '14px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              },
              className: 'font-light',
              descriptionClassName: 'font-light text-xs',
            }}
            theme="system"
          />
        {children}
        </ThemeProvider>
        </ConvexClientProvider>
        </body>
    </html>
  );
}
