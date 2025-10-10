'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    role: 'USER'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Une erreur est survenue.')
      } else {
        router.push('/auth/login')
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <Link href="/" className="text-3xl font-bold text-slate-900">
            Portail Talent
          </Link>
          <h2 className="mt-4 text-2xl font-bold tracking-tight">Créez votre compte</h2>
          <p className="mt-2 text-slate-600">
            Déjà un compte ?{' '}
            <Link href="/auth/login" className="font-semibold text-slate-800 hover:text-slate-900">
              Connectez-vous
            </Link>
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstname" className="block text-sm font-semibold text-slate-700">Prénom</label>
                <input id="firstname" name="firstname" type="text" required onChange={handleChange} className="mt-2 w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800" />
              </div>
              <div>
                <label htmlFor="lastname" className="block text-sm font-semibold text-slate-700">Nom</label>
                <input id="lastname" name="lastname" type="text" required onChange={handleChange} className="mt-2 w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800" />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700">Adresse email</label>
              <input id="email" name="email" type="email" autoComplete="email" required onChange={handleChange} className="mt-2 w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800" />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700">Mot de passe</label>
              <input id="password" name="password" type="password" autoComplete="new-password" required onChange={handleChange} className="mt-2 w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800" />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-semibold text-slate-700">Je suis un...</label>
              <select id="role" name="role" value={formData.role} onChange={handleChange} className="mt-2 w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 bg-white">
                <option value="USER">Candidat</option>
                <option value="RECRUITER">Recruteur</option>
              </select>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div>
              <button type="submit" disabled={loading} className="w-full flex justify-center bg-slate-800 hover:bg-slate-900 text-white px-4 py-3 rounded-lg font-semibold transition-colors disabled:bg-slate-400">
                {loading ? 'Création du compte...' : 'Créer mon compte'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
