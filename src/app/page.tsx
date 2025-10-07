'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Header from '@/components/layout/Header'
import Link from 'next/link'

export default function Home() {
  const { data: session, status } = useSession()
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    if (session) {
      setShowWelcome(true)
      // Masquer le message après 3 secondes
      const timer = setTimeout(() => {
        setShowWelcome(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [session])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Message de bienvenue animé */}
      {showWelcome && session && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">
                Bienvenue, {session.user.name} ! 👋
              </span>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {session ? (
          <div className="text-center">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Job Board
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Trouvez votre prochain emploi ou recrutez les meilleurs talents
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-indigo-600 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Offres d&apos;emploi</h3>
                <p className="text-gray-600 mb-4">Découvrez les dernières opportunités professionnelles</p>
                <Link href="/jobs" className="text-indigo-600 hover:text-indigo-500 font-medium">
                  Voir les offres →
                </Link>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-indigo-600 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Mon profil</h3>
                <p className="text-gray-600 mb-4">Gérez vos informations et candidatures</p>
                <Link href="/profile" className="text-indigo-600 hover:text-indigo-500 font-medium">
                  Voir le profil →
                </Link>
              </div>

              {(session.user.role === 'ADMIN' || session.user.role === 'RECRUITER') && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="text-indigo-600 mb-4">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Administration</h3>
                  <p className="text-gray-600 mb-4">Gérez les offres et candidatures</p>
                  <Link href="/admin" className="text-indigo-600 hover:text-indigo-500 font-medium">
                    Accéder à l&apos;admin →
                  </Link>
                </div>
              )}
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Bonjour {session.user.name} !
              </h2>
              <p className="text-gray-600 mb-6">
                Vous êtes connecté en tant que{' '}
                <span className="font-semibold text-indigo-600">
                  {session.user.role === 'ADMIN' ? 'Administrateur' :
                   session.user.role === 'RECRUITER' ? 'Recruteur' : 'Candidat'}
                </span>
              </p>
              
              {session.user.company && (
                <p className="text-gray-600">
                  Entreprise : <span className="font-semibold">{session.user.company.compName}</span>
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Job Board
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Trouvez votre prochain emploi ou recrutez les meilleurs talents
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Bienvenue !
              </h2>
              <p className="text-gray-600 mb-6">
                Connectez-vous pour accéder à toutes les fonctionnalités de la plateforme.
              </p>
              <div className="space-y-4">
                <Link
                  href="/auth/login"
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Se connecter
                </Link>
                <Link
                  href="/auth/register"
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  S&apos;inscrire
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
