'use client'

import React, { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type LoginFormState = {
  email: string
  password: string
  remember: boolean
}

export default function LoginPage() {
  const [form, setForm] = useState<LoginFormState>({
    email: '',
    password: '',
    remember: false,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const validate = () => {
    if (!form.email) return "Veuillez saisir votre adresse e‑mail."
    const emailRx = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
    if (!emailRx.test(form.email)) return "Adresse e‑mail invalide."
    if (!form.password || form.password.length < 6)
      return "Le mot de passe doit contenir au moins 6 caractères."
    return null
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
      const result = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false
      })

      if (result?.error) {
        setError('Email ou mot de passe incorrect')
      } else {
        // Récupérer la session pour rediriger selon le rôle
        const session = await getSession()
        if (session?.user?.role === 'ADMIN' || session?.user?.role === 'RECRUITER') {
          router.push('/admin')
        } else {
          router.push('/')
        }
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
          <h1 className="text-2xl font-semibold">Connexion</h1>
          <p className="text-sm text-gray-500 mt-1">Connecte-toi pour accéder à la plateforme</p>
        </header>

        <form onSubmit={onSubmit} className="space-y-4" aria-describedby="form-error">
          {error && (
            <div id="form-error" className="rounded-md bg-red-50 text-red-700 p-3 text-sm">
              {error}
            </div>
          )}

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
              autoComplete="current-password"
            />
          </label>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm">
              <input
                name="remember"
                type="checkbox"
                checked={form.remember}
                onChange={onChange}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-gray-600">Se souvenir de moi</span>
            </label>

            <Link href="/auth/forgot" className="text-sm text-indigo-600 hover:underline">
              Mot de passe oublié?
            </Link>
          </div>

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
            <span>{loading ? "Connexion..." : "Se connecter"}</span>
          </button>

          <div className="text-center text-sm text-gray-500">
            Pas encore de compte? <Link href="/auth/register" className="text-indigo-600 hover:underline">S&apos;inscrire</Link>
          </div>
        </form>

        {/* Comptes de test */}
        <div className="mt-6 border-t pt-4">
          <p className="text-center text-sm text-gray-500 mb-3">Comptes de test :</p>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span><strong>Admin:</strong> admin@jobboard.com</span>
              <span className="text-gray-400">password123</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span><strong>Recruteur:</strong> marie.dupont@techcorp.com</span>
              <span className="text-gray-400">password123</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span><strong>Candidat:</strong> jean.dubois@example.com</span>
              <span className="text-gray-400">password123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
