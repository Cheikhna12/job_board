import { SessionProvider } from '@/components/SessionProvider'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import './globals.css' // Assurez-vous que les styles globaux sont importés

export const metadata = {
  title: 'Job Board | Trouvez votre prochain emploi',
  description: 'Plateforme moderne pour connecter talents et entreprises innovantes.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-white font-sans text-slate-800 antialiased">
        <SessionProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </SessionProvider>
      </body>
    </html>
  )
}
