import "@/styles/globals.css";
import { Inter, Poppins } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-poppins" });

export const metadata = {
  title: "About - Menstrual App",
  description: "About Period App",
};

export default function Layout(props) {
  const { children } = props;

  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} light`}>
      <body className="bg-soft-cream text-text-gray font-display">{children}</body>
    </html>
  );
}
