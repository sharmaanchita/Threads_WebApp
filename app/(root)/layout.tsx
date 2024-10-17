import type { Metadata } from "next";
import {Inter} from "next/font/google"
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import TopBar from "@/components/shared/Topbar";
import LeftSideBar from "@/components/shared/Leftbar";
import RightSideBar from "@/components/shared/Rightbar";
import BottomBar from "@/components/shared/Bottombar";
import "@uploadthing/react/styles.css";

const inter = Inter({subsets: ["latin"]})

export const metadata: Metadata = {
  title: "Threads",
  description: "A Next.js 13 Meta Threads application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
      <body className={`${inter.className}`}>
        <TopBar/> // favicon not loading 

        <main className="flex flex-row">
          <LeftSideBar/>

          <section className="main-container">
            <div className="w-full max-w-4xl">
              {children}
            </div>
          </section>

          <RightSideBar/>
        </main>

        <BottomBar/>
      </body>
    </html>
    </ClerkProvider>
  );
}
