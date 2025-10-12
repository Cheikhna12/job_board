'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Loader from '@/components/ui/Loader'

type JobForm = {
  title: string
  type: string
  shortDescription: string
  description: string
  salary: number
  location: string
}

export default function EditJobPage() {
  const { id } = useParams()
  const router = useRouter()
  const [job, setJob] = useState<JobForm>({
    title: '',
    type: 'CDI',
    shortDescription: '',
    description: '',
    salary: 0,
    location: '',
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await fetch(`/api/jobs/${id}`)
        if (res.ok) {
          const data = await res.json()
          setJob({
            title: data.title,
            type: data.type,
            shortDescription: data.shortDescription,
            description: data.description,
            salary: data.salary,
            location: data.location,
          })
        } else {
          setError('Impossible de charger l\'offre')
        }
      } catch (err) {
        setError('Erreur lors du chargement')
      } finally {
        setLoading(false)
      }
    }
    fetchJob()
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job),
      })
      if (res.ok) {
        router.push(`/jobs/${id}`)
      } else {
        const err = await res.json()
        setError(err.error || 'Une erreur est survenue')
      }
    } catch (err) {
      setError('Erreur lors de la modification')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <Loader text="Chargement de l'offre..." />
  }

  if (error && !job.title) {
    return (
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-12">
        <div className="bg-red-50 text-red-700 p-6 rounded-lg">
          <strong>Erreur :</strong> {error}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link href={`/jobs/${id}`} className="text-sm text-slate-600 hover:text-slate-900 font-semibold">
          ← Retour à l'offre
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Modifier l'offre</h1>
        <p className="mt-2 text-lg text-slate-600">Mettez à jour les informations de l'offre d'emploi.</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg">
          <strong>Erreur :</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-2">
              Titre du poste *
            </label>
            <input
              type="text"
              id="title"
              value={job.title}
              onChange={(e) => setJob({ ...job, title: e.target.value })}
              required
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              placeholder="Ex: Développeur Full Stack"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-semibold text-slate-700 mb-2">
              Type de contrat *
            </label>
            <select
              id="type"
              value={job.type}
              onChange={(e) => setJob({ ...job, type: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              <option value="CDI">CDI</option>
              <option value="CDD">CDD</option>
              <option value="Stage">Stage</option>
              <option value="Freelance">Freelance</option>
            </select>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-semibold text-slate-700 mb-2">
              Localisation *
            </label>
            <input
              type="text"
              id="location"
              value={job.location}
              onChange={(e) => setJob({ ...job, location: e.target.value })}
              required
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              placeholder="Ex: Paris, France"
            />
          </div>

          <div>
            <label htmlFor="salary" className="block text-sm font-semibold text-slate-700 mb-2">
              Salaire annuel (€) *
            </label>
            <input
              type="number"
              id="salary"
              value={job.salary}
              onChange={(e) => setJob({ ...job, salary: Number(e.target.value) })}
              required
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              placeholder="Ex: 45000"
            />
          </div>

          <div>
            <label htmlFor="shortDescription" className="block text-sm font-semibold text-slate-700 mb-2">
              Description courte *
            </label>
            <textarea
              id="shortDescription"
              value={job.shortDescription}
              onChange={(e) => setJob({ ...job, shortDescription: e.target.value })}
              required
              rows={3}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              placeholder="Résumé court de l'offre (quelques lignes)"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-2">
              Description complète *
            </label>
            <textarea
              id="description"
              value={job.description}
              onChange={(e) => setJob({ ...job, description: e.target.value })}
              required
              rows={10}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              placeholder="Décrivez le poste en détail : missions, profil recherché, avantages..."
            />
          </div>
        </div>

        <div className="flex gap-4 mt-8 pt-6 border-t border-slate-200">
          <Link
            href={`/jobs/${id}`}
            className="flex-1 px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-semibold text-center"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-slate-800 hover:bg-slate-900 text-white px-6 py-2.5 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>
      </form>
    </div>
  )
}
