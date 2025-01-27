import localFont from "next/font/local";
import "./globals.css";
import ReactQueryProvider from '@/lib/ReactQueryProvider'
import LogSender from '@/lib/LogSender';
import NextTopLoader from 'nextjs-toploader';



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
  verification: {
    google: 'qtEKHujoxH7iCaGO2a53GVjxRKRVaYj1zoMDf6LNTNI',
    yandex: '110f9b7bc3c247b3',
  }
};


// setupAssociations()
export default async function RootLayout({ children }) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader />
        <LogSender/>
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
