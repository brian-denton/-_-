import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { headers } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DentonCodes",
  description:
    "Just a guy who loves to code. Follow my journey as I build projects, share knowledge, and explore the world of software development.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get nonce from headers for CSP
  const nonce = (await headers()).get("x-nonce");

  return (
    <html lang="en" suppressHydrationWarning>
      <head>{nonce && <meta property="csp-nonce" content={nonce} />}</head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <main className="flex-1">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
