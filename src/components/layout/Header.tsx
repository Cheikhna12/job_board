'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import Logo from './Logo'

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link 
    href={href}
    className="text-slate-600 font-semibold hover:text-slate-800 transition-colors">
    {children}
  </Link>
)
export default function Header() {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white/50 sticky top-0 z-40 backdrop-blur-xl">
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
                  <Link href="/admin" className="text-slate-600 font-semibold hover:text-slate-800 transition-colors">
                    Dashboard
                  </Link>
                )}
                <button 
                  onClick={() => signOut()} 
                  className="text-slate-600 font-semibold hover:text-slate-800 transition-colors"
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
                <Link href="/auth/login" className="text-slate-600 font-semibold hover:text-slate-800 transition-colors">
                  Connexion
                </Link>
                <Link href="/auth/register" className="bg-slate-800 text-neutral-400 font-semibold hover:text-white px-5 py-2.5 rounded-lg transition-colors">
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
        <div className="lg:hidden bg-slate-900 text-neutral-400 font-semibold py-6 px-6 animate-mobile-menu-out">
          <nav className="flex flex-col gap-6">
            <NavLink href="/jobs"><span className='hover:text-white' onClick={() => setIsMenuOpen(false)}>Trouver un emploi</span></NavLink>
            <NavLink href="/companies"><span className='hover:text-white' onClick={() => setIsMenuOpen(false)}>Entreprises</span></NavLink>
            <NavLink href="/about"><span className='hover:text-white' onClick={() => setIsMenuOpen(false)}>A propos</span></NavLink>
          </nav>
          <div className="mt-5 flex flex-col gap-6">
          {status === 'loading' ? (
              <div className="h-10 w-full bg-white rounded-lg animate-pulse"></div>
            ) : session ? (
              <>
                {(session.user.role === 'ADMIN' || session.user.role === 'RECRUITER') && (
                  <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="hover:text-white transition-colors">
                    Dashboard
                  </Link>
                )}
                  <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="hover:text-white transition-colors">
                    Mon Profil
                  </Link>
                  <div className='bg-white border-t border-slate-200'></div>
                  <button 
                    onClick={() => {
                      signOut()
                      setIsMenuOpen(false)
                    }} 
                    className="w-full mt-4 py-3 bg-red-400 text-neutral-50 rounded-lg transition-colors hover:bg-red-500"
                  >
                    Déconnexion
                  </button>
              </>
            ) : (
              <>
                <div className='bg-white border-t border-slate-200'></div>
                <Link
                  href="/auth/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full bg-neutral-200 hover:bg-slate-900 text-slate-800 hover:text-white font-semibold py-2 rounded-lg text-center transition-all duration-200 border-2 border-transparent hover:border-slate-500"
                >
                  Connexion
                </Link>
                <Link 
                  href="/auth/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full bg-neutral-200 hover:bg-slate-900 text-slate-800 hover:text-white font-semibold py-2 rounded-lg text-center transition-all duration-200 border-2 border-transparent hover:border-slate-500"
                >
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