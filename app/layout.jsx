import localFont from "next/font/local";
import "./globals.css";
import ReactQueryProvider from '@/lib/ReactQueryProvider'
import { setupAssociations } from "@/models/setup";


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

export const metadata = {
  title: "Dcrypt",
  description: "DCRYPT",
};


setupAssociations()
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>
          
           
            {children}
         
        </ReactQueryProvider>
      </body>
    </html>
  ); 
}
