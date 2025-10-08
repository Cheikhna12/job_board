'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import 'swagger-ui-react/swagger-ui.css'

// Import dynamique pour éviter les erreurs SSR
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false })

export default function ApiDocsPage() {
  const [spec, setSpec] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/swagger')
      .then((res) => res.json())
      .then((data) => {
        setSpec(data)
        setLoading(false)
      })
      .catch((err) => {
        setError('Erreur lors du chargement de la documentation API')
        setLoading(false)
        console.error(err)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de la documentation API...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Erreur</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      {spec && (
        <SwaggerUI
          spec={spec}
          docExpansion="list"
          defaultModelsExpandDepth={2}
          defaultModelExpandDepth={2}
          tryItOutEnabled={true}
          displayRequestDuration={true}
          filter={true}
          showExtensions={true}
          showCommonExtensions={true}
        />
      )}
    </div>
  )
}
