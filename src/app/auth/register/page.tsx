'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type RegisterFormState = {
  firstname: string
  lastname: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterFormState>({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const validate = () => {
    if (!form.firstname) return "Veuillez saisir votre prénom."
    if (!form.lastname) return "Veuillez saisir votre nom."
    if (!form.email) return "Veuillez saisir votre adresse e‑mail."
    const emailRx = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
    if (!emailRx.test(form.email)) return "Adresse e‑mail invalide."
    if (!form.password || form.password.length < 8)
      return "Le mot de passe doit contenir au moins 8 caractères."
    if (form.password !== form.confirmPassword)
      return "Les mots de passe ne correspondent pas."
    return null
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const v = validate()
    if (v) {
      setError(v)
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstname: form.firstname,
          lastname: form.lastname,
          email: form.email,
          phone: form.phone,
          password: form.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Une erreur est survenue')
      } else {
        router.push('/auth/login?message=Compte créé avec succès')
      }
    } catch (err: unknown) {
      console.error(err)
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-semibold">Inscription</h1>
          <p className="text-sm text-gray-500 mt-1">Créez votre compte pour accéder à la plateforme</p>
        </header>

        <form onSubmit={onSubmit} className="space-y-4" aria-describedby="form-error">
          {error && (
            <div id="form-error" className="rounded-md bg-red-50 text-red-700 p-3 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Prénom</span>
              <input
                name="firstname"
                type="text"
                value={form.firstname}
                onChange={onChange}
                required
                className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 p-2"
                placeholder="Votre prénom"
                autoComplete="given-name"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Nom</span>
              <input
                name="lastname"
                type="text"
                value={form.lastname}
                onChange={onChange}
                required
                className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 p-2"
                placeholder="Votre nom"
                autoComplete="family-name"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Adresse e‑mail</span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              required
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 p-2"
              placeholder="exemple@domaine.com"
              autoComplete="email"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Téléphone (optionnel)</span>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={onChange}
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 p-2"
              placeholder="+33 6 12 34 56 78"
              autoComplete="tel"
            />
          </label>

          <label className="block">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Mot de passe</span>
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="text-xs text-indigo-600 hover:underline"
                aria-pressed={showPassword}
              >
                {showPassword ? "Cacher" : "Afficher"}
              </button>
            </div>

            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={onChange}
              required
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 p-2"
              placeholder="Votre mot de passe"
              autoComplete="new-password"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Confirmer le mot de passe</span>
            <input
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={onChange}
              required
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 p-2"
              placeholder="Confirmez votre mot de passe"
              autoComplete="new-password"
            />
          </label>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            ) : null}
            <span>{loading ? "Inscription..." : "S'inscrire"}</span>
          </button>

          <div className="text-center text-sm text-gray-500">
            Déjà un compte? <Link href="/auth/login" className="text-indigo-600 hover:underline">Se connecter</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
