// src/app/layout.js
import Navbar from "./components/Navbar/page";
import { Inter } from "next/font/google";
import "./globals.css";

import { getServerSession } from "next-auth";
import SessionProvider from "../utils/SessionProvider";
import Loading from "./loading.js";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Frutier",
  description: "A healthy nutrition tracker",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session} fallback={<Loading />}>
          <div className="">
            <Navbar />
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
