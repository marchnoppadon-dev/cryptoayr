import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

const GA_ID = ""; // TODO: ใส่ Measurement ID ใหม่ของ cryptoayr เช่น "G-XXXXXXXXXX"

export const metadata: Metadata = {
  metadataBase: new URL("https://www.cryptoayr.com"),
  title: {
    default: "CRYPTOAYR — ข่าวคริปโตภาษาไทย อัปเดตทุกวัน",
    template: "%s | CRYPTOAYR",
  },
  description:
    "สรุปข่าวคริปโตวันนี้ ภาษาไทย อ่านง่าย อัปเดตทุกวัน พร้อมความรู้พื้นฐานบิทคอยน์คืออะไร คริปโตคืออะไร สำหรับมือใหม่และนักลงทุน",
  keywords: [
    "ข่าวคริปโตวันนี้",
    "บิทคอยน์คืออะไร",
    "คริปโตคืออะไร",
    "ราคาบิทคอยน์วันนี้",
    "สรุปข่าวคริปโตประจำวัน",
  ],
  openGraph: {
    type: "website",
    locale: "th_TH",
    siteName: "CRYPTOAYR",
    title: "CRYPTOAYR — ข่าวคริปโตภาษาไทย อัปเดตทุกวัน",
    description:
      "สรุปข่าวคริปโตวันนี้ ภาษาไทย อ่านง่าย อัปเดตทุกวัน พร้อมความรู้พื้นฐานสำหรับมือใหม่และนักลงทุน",
    images: ["/cryptoayr-hero-banner.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "CRYPTOAYR — ข่าวคริปโตภาษาไทย อัปเดตทุกวัน",
    description:
      "สรุปข่าวคริปโตวันนี้ ภาษาไทย อ่านง่าย อัปเดตทุกวัน พร้อมความรู้พื้นฐานสำหรับมือใหม่และนักลงทุน",
    images: ["/cryptoayr-hero-banner.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {GA_ID && (
          <>
            <Script
              src={"https://www.googletagmanager.com/gtag/js?id=" + GA_ID}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
        {children}
      </body>
    </html>
  );
}