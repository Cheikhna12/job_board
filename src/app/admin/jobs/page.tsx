'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Типы
interface Job {
  id: string;
  title: string;
  company: {
    compName: string;
  };
  type: string;
  status: 'PUBLISHED' | 'ARCHIVED';
  _count?: {
    jobApplications: number;
  };
}

// JobRow теперь принимает onArchive и onDelete
const JobRow = ({
  job,
  onArchive,
  onDelete,
}: {
  job: Job;
  onArchive: (id: string, status: 'ARCHIVED' | 'PUBLISHED') => void;
  onDelete: (id: string) => void;
}) => {
  const isArchived = job.status === 'ARCHIVED';

  return (
    <tr className={`border-b border-slate-200 hover:bg-slate-50 ${isArchived ? 'bg-slate-50 text-slate-500' : ''}`}>
      <td className="p-4">
        <div className={`font-bold ${isArchived ? 'text-slate-500' : 'text-slate-900'}`}>{job.title}</div>
        <div className="text-sm text-slate-500">{job.company.compName}</div>
      </td>
      <td className="p-4">{job.type}</td>
      <td className="p-4">
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${isArchived ? 'bg-slate-200 text-slate-600' : 'bg-green-100 text-green-800'}`}>
          {isArchived ? 'Archivée' : 'Publiée'}
        </span>
      </td>
      <td className="p-4">{job._count?.jobApplications || 0}</td>
      <td className="p-4 text-right">
        <div className="flex justify-end gap-3">
          <Link href={`/jobs/${job.id}/edit`} className="text-sm font-semibold text-slate-600 hover:text-slate-900">
            Modifier
          </Link>

          <button
            onClick={() => onArchive(job.id, isArchived ? 'PUBLISHED' : 'ARCHIVED')}
            className={`text-sm font-semibold ${isArchived ? 'text-blue-600 hover:text-blue-900' : 'text-yellow-600 hover:text-yellow-900'}`}
          >
            {isArchived ? 'Publier' : 'Archiver'}
          </button>

          <button
            onClick={() => {
              if (confirm('Supprimer définitivement cette offre ?')) {
                onDelete(job.id)
              }
            }}
            className="text-sm font-semibold text-red-600 hover:text-red-900"
          >
            Supprimer
          </button>
        </div>
      </td>
    </tr>
  )
}

export default function AdminJobsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'authenticated') {
      fetchJobs()
    } else if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs')
      if (response.ok) {
        const data = await response.json()
        setJobs(data)
      } else {
        setError('Impossible de charger les offres.')
      }
    } catch (err) {
      setError('Erreur lors du chargement des offres.')
    } finally {
      setLoading(false)
    }
  }

  const handleArchive = async (id: string, newStatus: 'ARCHIVED' | 'PUBLISHED') => {
    const originalJobs = [...jobs]
    setJobs(jobs.map((j) => (j.id === id ? { ...j, status: newStatus } : j)))

    try {
      const response = await fetch(`/api/jobs/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        setError('Erreur lors de la mise à jour du statut.')
        setJobs(originalJobs)
      }
    } catch (err) {
      setError('Erreur lors de la mise à jour.')
      setJobs(originalJobs)
    }
  }

  const handleDelete = async (id: string) => {
    const originalJobs = [...jobs]
    // optimistic UI: удаляем сразу
    setJobs(jobs.filter((j) => j.id !== id))

    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        setError('Erreur lors de la suppression.')
        setJobs(originalJobs) // revert
      }
    } catch (err) {
      setError('Erreur serveur.')
      setJobs(originalJobs) // revert
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Offres</h1>
          <p className="mt-2 text-lg text-slate-600">Consultez, modifiez, archivez ou supprimez les offres d'emploi.</p>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
        <Link
          href="/jobs/create"
          className="mt-4 sm:mt-0 bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors"
        >
          Créer une offre
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="p-4 font-semibold">Poste</th>
                <th className="p-4 font-semibold">Type</th>
                <th className="p-4 font-semibold">Statut</th>
                <th className="p-4 font-semibold">Candidatures</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center p-8">Chargement...</td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <JobRow
                    key={job.id}
                    job={job}
                    onArchive={handleArchive}
                    onDelete={handleDelete}   // <- обязательно передаём onDelete
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
