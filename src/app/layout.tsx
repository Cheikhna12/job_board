import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from '@/components/SessionProvider'

export const metadata: Metadata = {
  title: "Job Board - Plateforme d'offres d'emploi",
  description: "Trouvez votre prochain emploi ou recrutez les meilleurs talents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
