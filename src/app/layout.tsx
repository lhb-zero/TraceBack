import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TraceBack - 项目复盘系统",
  description: "个人项目复盘与技术成长追踪系统",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="flex min-h-screen flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
