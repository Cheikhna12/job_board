import Link from 'next/link'

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="text-slate-500 hover:text-slate-300 transition-colors">
    {children}
  </Link>
)

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-2xl font-bold text-neutral-300">
              JobBoard
            </Link>
            <p className="mt-4 text-slate-500 max-w-xs">
              La plateforme de confiance pour connecter les talents et les entreprises.
            </p>
          </div>

          {/* Liens de navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 lg:col-span-3">
            <div>
              <h3 className="font-extrabold text-neutral-300">Candidats</h3>
              <ul className="mt-4 space-y-3">
                <li><FooterLink href="/jobs">Toutes les offres</FooterLink></li>
                <li><FooterLink href="/companies">Toutes les entreprises</FooterLink></li>
                <li><FooterLink href="/profile">Mon profil</FooterLink></li>
              </ul>
            </div>
            <div>
              <h3 className="font-extrabold text-neutral-300">Entreprises</h3>
              <ul className="mt-4 space-y-3">
                <li><FooterLink href="/jobs/create">Publier une offre</FooterLink></li>
                <li><FooterLink href="/admin">Dashboard</FooterLink></li>
              </ul>
            </div>
            <div>
              <h3 className="font-extrabold text-neutral-300">Ressources</h3>
              <ul className="mt-4 space-y-3">
                <li><FooterLink href="/about">À propos</FooterLink></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Ligne de séparation et crédits */}
        <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-center items-center">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} JobBoard. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}
