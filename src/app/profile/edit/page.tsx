'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
}

export default function EditProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchProfile()
    } else if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, session, router])

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/users/${session?.user?.id}`)
      if (response.ok) {
        const profile: UserProfile = await response.json()
        setFormData({
          firstname: profile.firstname,
          lastname: profile.lastname,
          email: profile.email,
          phone: profile.phone || ''
        })
      } else {
        setError('Impossible de charger le profil')
      }
    } catch (err) {
      setError('Erreur lors du chargement du profil')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`/api/users/${session?.user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setSuccess('Profil mis à jour avec succès !')
        setTimeout(() => {
          router.push('/profile')
        }, 2000)
      } else {
        const data = await response.json()
        setError(data.error || 'Erreur lors de la mise à jour')
      }
    } catch (err) {
      setError('Erreur lors de la mise à jour du profil')
    } finally {
      setSaving(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null // Redirection en cours
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        {/* Fil d'Ariane */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/" className="hover:text-slate-900">Accueil</Link>
          <span>/</span>
          <Link href="/profile" className="hover:text-slate-900">Mon profil</Link>
          <span>/</span>
          <span className="font-semibold text-slate-800">Modifier</span>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Modifier mon profil</h1>
          <p className="text-lg text-slate-600">Mettez à jour vos informations personnelles.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <p className="text-green-800 font-medium">{success}</p>
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Prénom *
                </label>
                <input
                  name="firstname"
                  type="text"
                  value={formData.firstname}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Nom *
                </label>
                <input
                  name="lastname"
                  type="text"
                  value={formData.lastname}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email *
                </label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Téléphone
                </label>
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Ex: +33 1 23 45 67 89"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Link
                href="/profile"
                className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-semibold text-center transition-colors"
              >
                Annuler
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-xl">
          <h3 className="text-lg font-bold mb-2">Informations importantes</h3>
          <ul className="text-sm text-slate-600 space-y-1">
            <li>• Votre rôle et votre entreprise ne peuvent pas être modifiés ici</li>
            <li>• Pour changer votre mot de passe, contactez l'administrateur</li>
            <li>• Vos modifications seront visibles immédiatement</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
