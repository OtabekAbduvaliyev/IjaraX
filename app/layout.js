import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { Lekton } from 'next/font/google'

const lekton = Lekton({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
})


import HeaderOrg from "./components/HeaderProtector";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "IjaraX - Eng muqobil ijaralar",
  description: "IjaraX sizga O'zbekistondagi eng yaxshi ijaralarini topishda yordam beradi.",
  keywords: "ijara, ular, Uzbekistan, mulk, ijara jizzax, ijara tashkent, ijara samarqand, ijara andijon, ijara fargona, ijara namangan, ijara navoiy, ijara buxoro, ijara qashqadaryo, ijara surxondaryo, ijara xorazm, ijara karakalpakstan, ijaraga berish, ijaraga berish tashkent, ijaraga berish jizzax, ijaraga berish samarqand, ijaraga berish andijon, ijaraga berish fargona, ijaraga berish namangan, ijaraga berish navoiy, ijaraga berish buxoro, ijaraga berish qashqadaryo, ijaraga berish surxondaryo, ijaraga berish xorazm, ijaraga berish karakalpakstan",
  openGraph: {
    title: "IjaraX - Eng muqobil ijaralar",
    description: "IjaraX sizga O'zbekistondagi eng yaxshi ijaralarini topishda yordam beradi.",
    url: "https://ijara-x.vercel.app/",
    siteName: "IjaraX",
    images: [
      {
        url: "https://ijara-x.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "IjaraX - Eng muqobil ijaralar",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IjaraX - Eng muqobil ijaralar",
    description: "IjaraX sizga O'zbekistondagi eng yaxshi ijaralarini topishda yordam beradi.",
    images: [{url:"https://ijara-x.vercel.app/og-image.jpg"}],
  },
  robots: {
    index: true,
    follow: true,
  },
};


export default function RootLayout({ children }) {
  
  return (
    <html lang="en">
      <body className={lekton.className}>
        <AuthProvider>
         <HeaderOrg />
          {children}</AuthProvider>
      </body>
    </html>
  );
}
