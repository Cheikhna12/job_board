'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import Logo from './Logo'

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
    {children}
  </Link>
)

export default function Header() {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-40 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Logo />

          {/* Navigation principale (Desktop) */}
          <nav className="hidden lg:flex items-center gap-8">
            <NavLink href="/jobs">Trouver un emploi</NavLink>
            <NavLink href="/companies">Entreprises</NavLink>
            <NavLink href="/about">À propos</NavLink>
          </nav>

          {/* Actions (Desktop) */}
          <div className="hidden lg:flex items-center gap-4">
            {status === 'loading' ? (
              <div className="h-10 w-24 bg-slate-200 rounded-lg animate-pulse"></div>
            ) : session ? (
              <div className="flex items-center gap-4">
                {(session.user.role === 'ADMIN' || session.user.role === 'RECRUITER') && (
                  <Link href="/admin" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
                    Dashboard
                  </Link>
                )}
                <button 
                  onClick={() => signOut()} 
                  className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
                >
                  Déconnexion
                </button>
                <Link 
                  href="/profile"
                  className="w-10 h-10 bg-slate-800 text-white rounded-full flex items-center justify-center font-semibold"
                >
                  {session.user.name?.charAt(0)}
                </Link>
              </div>
            ) : (
              <>
                <Link href="/auth/login" className="text-slate-600 hover:text-slate-900 font-semibold transition-colors">
                  Connexion
                </Link>
                <Link href="/auth/register" className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors">
                  Inscription
                </Link>
              </>
            )}
          </div>

          {/* Menu Burger (Mobile) */}
          <div className="lg:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-800">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 py-6 px-6">
          <nav className="flex flex-col gap-6">
            <NavLink href="/jobs">Trouver un emploi</NavLink>
            <NavLink href="/companies">Entreprises</NavLink>
            <NavLink href="/about">À propos</NavLink>
          </nav>
          <div className="mt-6 pt-6 border-t border-slate-200 flex flex-col gap-4">
          {status === 'loading' ? (
              <div className="h-10 w-full bg-slate-200 rounded-lg animate-pulse"></div>
            ) : session ? (
              <>
                {(session.user.role === 'ADMIN' || session.user.role === 'RECRUITER') && (
                  <Link href="/admin" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
                    Dashboard
                  </Link>
                )}
                 <Link href="/profile" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
                    Mon Profil
                  </Link>
                <button 
                  onClick={() => signOut()} 
                  className="text-left text-slate-600 hover:text-slate-900 font-medium transition-colors"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-slate-600 hover:text-slate-900 font-semibold transition-colors">
                  Connexion
                </Link>
                <Link href="/auth/register" className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors text-center">
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
