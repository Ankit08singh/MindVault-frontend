import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <>
    <div className="min-h-screen  bg-zinc-950 "></div>
    <div className="min-h-screen bg-black flex justify-center items-center ">
        <h1 className="text-3xl font-extrabold text-white">Hello</h1>
        <button className="rounded-2xl p-2 text-white bg-amber-200">Click me</button>
      
    </div>
    </>
  );
}
