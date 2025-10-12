'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Loader from '@/components/ui/Loader'

export default function CreateCompanyPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    compName: '',
    place: '',
    information: '',
    website: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/admin/companies')
      } else {
        setError(data.error || 'Une erreur est survenue')
      }
    } catch (err) {
      setError('Erreur lors de la création de l\'entreprise')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return <Loader text="Chargement..." />
  }

  if (status === 'unauthenticated') {
    router.push('/auth/login')
    return null
  }

  if (session?.user?.role !== 'ADMIN') {
    router.push('/admin')
    return null
  }

  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link href="/admin/companies" className="text-sm text-slate-600 hover:text-slate-900 font-semibold">
          ← Retour à la gestion des entreprises
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Créer une entreprise</h1>
        <p className="mt-2 text-lg text-slate-600">Ajoutez une nouvelle entreprise partenaire.</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg">
          <strong>Erreur :</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
        <div className="space-y-6">
          <div>
            <label htmlFor="compName" className="block text-sm font-semibold text-slate-700 mb-2">
              Nom de l'entreprise *
            </label>
            <input
              type="text"
              id="compName"
              name="compName"
              value={formData.compName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              placeholder="Ex: TechCorp"
            />
          </div>

          <div>
            <label htmlFor="place" className="block text-sm font-semibold text-slate-700 mb-2">
              Localisation *
            </label>
            <input
              type="text"
              id="place"
              name="place"
              value={formData.place}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              placeholder="Ex: Paris, France"
            />
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-semibold text-slate-700 mb-2">
              Site web
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              placeholder="Ex: https://www.techcorp.com"
            />
          </div>

          <div>
            <label htmlFor="information" className="block text-sm font-semibold text-slate-700 mb-2">
              Description
            </label>
            <textarea
              id="information"
              name="information"
              value={formData.information}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              placeholder="Présentez l'entreprise..."
            />
          </div>
        </div>

        <div className="flex gap-4 mt-8 pt-6 border-t border-slate-200">
          <Link
            href="/admin/companies"
            className="flex-1 px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-semibold text-center"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-slate-800 hover:bg-slate-900 text-white px-6 py-2.5 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Création...' : 'Créer l\'entreprise'}
          </button>
        </div>
      </form>
    </div>
  )
}
