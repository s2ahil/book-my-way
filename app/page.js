import Image from "next/image";
import Navbar from "@/components/Navbar"
import Signup from "./_components/signup";
export default function Home() {
  return (
    <main className=" ">
      {/* <Navbar></Navbar>
      hello */}
      <Signup></Signup>
    </main>
  );
}
