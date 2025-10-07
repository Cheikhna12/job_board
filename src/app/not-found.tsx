import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-indigo-600">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mt-4">Page non trouvée</h2>
          <p className="text-gray-600 mt-4 max-w-md mx-auto">
            Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Retour à l&apos;accueil
          </Link>
          
          <div className="text-sm text-gray-500">
            <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-500">
              Se connecter
            </Link>
            {' • '}
            <Link href="/jobs" className="text-indigo-600 hover:text-indigo-500">
              Voir les offres
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
