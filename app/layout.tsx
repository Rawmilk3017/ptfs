import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "PTFS Flight Team", description: "Official website and event schedule for our PTFS team." };
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}
