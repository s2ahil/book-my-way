import { Inter } from "next/font/google";
import "./globals.css";

import Provider from "./_components/Provider";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Book my way",
  description: "Website to book seats",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
