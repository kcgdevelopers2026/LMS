import type { Metadata } from "next";


import Footer from "../components/footer/page";

export const metadata: Metadata = {
  title: "KC Jewellery",
  description: "KC Chinnadurai Gold Jewellery App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>

        {/* PAGE CONTENT */}
        <main className="appMain">
          {children}
        </main>

        {/* COMMON FOOTER (ALL PAGES) */}
        <Footer />

      </body>
    </html>
  );
}