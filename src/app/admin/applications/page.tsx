'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ApplicationStatus } from '@prisma/client'
import Loader from '@/components/ui/Loader'

interface Application {
  id: string;
  applicantName: string;
  applicantEmail: string;
  job: {
    id: string;
    title: string;
  };
  status: 'ACCEPTEE' | 'REFUSEE' | 'EN_ATTENTE';
  createdAt: string;
}

const ApplicationRow = ({
  application,
  onStatusChange,
  onDelete,
}: {
  application: Application;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  onDelete: (id: string) => void;
}) => (
  <tr className="border-b border-slate-200 hover:bg-slate-50">
    <td className="p-4">
      <div className="font-bold text-slate-900">{application.applicantName}</div>
      <div className="text-sm text-slate-500">{application.applicantEmail}</div>
    </td>
    <td className="p-4">
      <Link href={`/jobs/${application.job.id}`} className="font-semibold text-slate-800 hover:underline">
        {application.job.title}
      </Link>
    </td>
    <td className="p-4">
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full ${
          application.status === 'ACCEPTEE'
            ? 'bg-green-100 text-green-800'
            : application.status === 'REFUSEE'
            ? 'bg-red-100 text-red-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}
      >
        {application.status || 'EN_ATTENTE'}
      </span>
    </td>
    <td className="p-4 text-slate-600">
      {new Date(application.createdAt).toLocaleDateString('fr-FR')}
    </td>
    <td className="p-4 text-right">
      <div className="flex justify-end gap-3 items-center">
        <select
          value={application.status}
          onChange={(e) =>
            onStatusChange(application.id, e.target.value as ApplicationStatus)
          }
          className="text-sm font-semibold text-slate-600 hover:text-slate-900 bg-transparent border-none"
        >
          <option value="EN_ATTENTE">En attente</option>
          <option value="ACCEPTEE">Acceptée</option>
          <option value="REFUSEE">Refusée</option>
        </select>

        <button
          onClick={() => {
            if (confirm('Supprimer cette candidature ?')) {
              onDelete(application.id)
            }
          }}
          className="text-red-500 hover:text-red-700 text-sm font-semibold"
          title="Supprimer la candidature"
        >
          Supprimer
        </button>
      </div>
    </td>
  </tr>
)

export default function AdminApplicationsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'authenticated') {
      fetchApplications()
    } else if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/applications')
      if (response.ok) {
        const data = await response.json()
        setApplications(data)
      } else {
        setError('Impossible de charger les candidatures.')
      }
    } catch (err) {
      setError('Erreur lors du chargement des candidatures.')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: string, newStatus: ApplicationStatus) => {
    const originalApplications = [...applications]
    setApplications(
      applications.map((app) =>
        app.id === id ? { ...app, status: newStatus } : app
      )
    )

    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        setError('Erreur lors de la mise à jour du statut.')
        setApplications(originalApplications)
      }
    } catch (err) {
      setError('Erreur lors de la mise à jour.')
      setApplications(originalApplications)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setApplications(applications.filter((app) => app.id !== id))
      } else {
        const data = await response.json()
        setError(data.error || 'Erreur lors de la suppression.')
      }
    } catch (err) {
      setError('Erreur réseau lors de la suppression.')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Candidatures</h1>
        <p className="mt-2 text-lg text-slate-600">
          Consultez, traitez et supprimez les candidatures reçues pour vos offres.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="p-4 font-semibold">Candidat</th>
                <th className="p-4 font-semibold">Offre d'emploi</th>
                <th className="p-4 font-semibold">Statut</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5}>
                    <Loader text="Chargement des candidatures..." />
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <ApplicationRow
                    key={app.id}
                    application={app}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600 font-semibold">{error}</p>
      )}
    </div>
  )
}
