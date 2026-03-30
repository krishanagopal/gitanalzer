import "./globals.css";
import { NavBar } from "../components/NavBar";

export const metadata = {
  title: "GitAnalyzer | The True Measure of a Developer",
  description: "Evaluate engineering depth, project complexity, and collaboration patterns.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="bg-black min-h-screen text-white font-body selection:bg-white selection:text-black flex flex-col">
        <NavBar />
        <main className="flex-grow flex flex-col relative">
          {children}
        </main>
      </body>
    </html>
  );
}
