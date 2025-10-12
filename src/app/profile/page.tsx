'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface UserProfile {
  id: string
  firstname: string
  lastname: string
  email: string
  phone?: string
  role: string
  company?: {
    id: string
    compName: string
    place: string
  }
  createdAt: string
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchProfile()
    } else if (status === 'unauthenticated') {
      setLoading(false)
    }
  }, [status, session])

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/users/${session?.user?.id}`)
      if (response.ok) {
        const result = await response.json()
        setProfile(result)
      } else {
        setError('Impossible de charger le profil')
      }
    } catch (err) {
      setError('Erreur lors du chargement du profil')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement du profil...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Connexion requise</h1>
          <p className="text-slate-600 mb-6">Vous devez être connecté pour voir votre profil.</p>
          <Link href="/auth/login" className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            Se connecter
          </Link>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Erreur</h1>
          <p className="text-slate-600 mb-6">{error}</p>
          <button 
            onClick={fetchProfile}
            className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Profil non trouvé</h1>
          <Link href="/" className="text-slate-600 hover:text-slate-900 font-semibold">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    )
  }

  const getRoleBadge = (role: string) => {
    const styles = {
      ADMIN: 'bg-red-100 text-red-800',
      RECRUITER: 'bg-blue-100 text-blue-800',
      USER: 'bg-slate-100 text-slate-800'
    }
    return styles[role as keyof typeof styles] || styles.USER
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        {/* Fil d'Ariane */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/" className="hover:text-slate-900">Accueil</Link>
          <span>/</span>
          <span className="font-semibold text-slate-800">Mon profil</span>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Mon profil</h1>
          <p className="text-lg text-slate-600">Gérez vos informations personnelles et vos préférences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations principales */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Informations personnelles</h2>
                <Link
                  href="/profile/edit"
                  className="text-sm font-semibold text-slate-600 hover:text-slate-900"
                >
                  Modifier
                </Link>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-slate-200 border border-slate-300 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-slate-600">
                      {profile.firstname.charAt(0)}{profile.lastname.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{profile.firstname} {profile.lastname}</h3>
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadge(profile.role)}`}>
                      {profile.role}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                    <p className="text-slate-900">{profile.email}</p>
                  </div>

                  {profile.phone && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Téléphone</label>
                      <p className="text-slate-900">{profile.phone}</p>
                    </div>
                  )}

                  {profile.company && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Entreprise</label>
                      <p className="text-slate-900">{profile.company.compName}</p>
                      {profile.company.place && (
                        <p className="text-sm text-slate-500">{profile.company.place}</p>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Membre depuis</label>
                    <p className="text-slate-900">{new Date(profile.createdAt).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions rapides */}
          <div>
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold mb-4">Actions rapides</h3>
              <div className="space-y-3">
                <Link
                  href="/profile/edit"
                  className="block w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <div className="font-semibold text-slate-800">Modifier le profil</div>
                  <div className="text-sm text-slate-500">Mettre à jour vos informations</div>
                </Link>

                {profile.role === 'RECRUITER' && (
                  <Link
                    href="/jobs/create"
                    className="block w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <div className="font-semibold text-slate-800">Créer une offre</div>
                    <div className="text-sm text-slate-500">Publier un nouveau poste</div>
                  </Link>
                )}

                <Link
                  href="/applications"
                  className="block w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <div className="font-semibold text-slate-800">Mes candidatures</div>
                  <div className="text-sm text-slate-500">Voir l'historique</div>
                </Link>

                {profile.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="block w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <div className="font-semibold text-slate-800">Administration</div>
                    <div className="text-sm text-slate-500">Panneau d'admin</div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
