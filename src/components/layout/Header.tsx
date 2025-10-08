'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function Header() {
  const { data: session, status } = useSession()

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Job Board
            </Link>
          </div>

          <nav className="flex items-center space-x-4">
            {status === 'loading' ? (
              <div>Chargement...</div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Bonjour, {session.user.name}
                </span>
                {(session.user.role === 'ADMIN' || session.user.role === 'RECRUITER') && (
                  <>
                    <Link
                      href="/admin"
                      className="text-sm text-blue-600 hover:text-blue-500"
                    >
                      Administration
                    </Link>
                    <Link
                      href="/api-docs"
                      className="text-sm text-green-600 hover:text-green-500"
                    >
                      API Docs
                    </Link>
                  </>
                )}
                <button
                  onClick={() => signOut()}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/login"
                  className="text-sm text-gray-700 hover:text-gray-900"
                >
                  Connexion
                </Link>
                <Link
                  href="/auth/register"
                  className="text-sm bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
                >
                  Inscription
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
