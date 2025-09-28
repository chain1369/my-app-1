import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "人生追踪器 - 记录成长的每一步",
  description: "一个优雅的人生数据管理系统，追踪你的技能、资产、健康和里程碑",
  keywords: ["人生管理", "技能追踪", "资产管理", "里程碑", "个人成长", "数据可视化"],
  authors: [{ name: "人生追踪器团队" }],
  creator: "人生追踪器",
  publisher: "人生追踪器",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://your-domain.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "人生追踪器 - 记录成长的每一步",
    description: "一个优雅的人生数据管理系统，追踪你的技能、资产、健康和里程碑",
    url: 'https://your-domain.com',
    siteName: '人生追踪器',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '人生追踪器',
      },
    ],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "人生追踪器 - 记录成长的每一步",
    description: "一个优雅的人生数据管理系统，追踪你的技能、资产、健康和里程碑",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '人生追踪器',
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="人生追踪器" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
