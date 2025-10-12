'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Loader from '@/components/ui/Loader'
import ConfirmModal from '@/components/ui/ConfirmModal'

interface Company {
  id: string;
  compName: string;
  place: string;
  _count?: {
    jobs: number;
    users: number;
  };
  createdAt: string;
}

const CompanyRow = ({ company, onDelete }: { company: Company, onDelete: (company: Company) => void }) => (
  <tr className="border-b border-slate-200 hover:bg-slate-50">
    <td className="p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center">
          <span className="font-bold text-slate-800">{company.compName.charAt(0)}</span>
        </div>
        <div>
          <div className="font-bold text-slate-900">{company.compName}</div>
          <div className="text-sm text-slate-500">{company.place}</div>
        </div>
      </div>
    </td>
    <td className="p-4 text-slate-600">{company._count?.jobs || 0}</td>
    <td className="p-4 text-slate-600">{company._count?.users || 0}</td>
    <td className="p-4 text-slate-600">{new Date(company.createdAt).toLocaleDateString('fr-FR')}</td>
    <td className="p-4 text-right">
      <div className="flex justify-end gap-2">
        <Link href={`/companies/${company.id}`} className="text-sm font-semibold text-slate-600 hover:text-slate-900">Voir</Link>
        <Link href={`/admin/companies/${company.id}/edit`} className="text-sm font-semibold text-slate-600 hover:text-slate-900">Modifier</Link>
        <button onClick={() => onDelete(company)} className="text-sm font-semibold text-red-600 hover:text-red-900">Supprimer</button>
      </div>
    </td>
  </tr>
)

export default function AdminCompaniesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchCompanies = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/companies')
      const data = await response.json()
      setCompanies(data.data || [])
    } catch (error) {
      console.error('Failed to fetch companies:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      if (session.user.role !== 'ADMIN') {
        router.push('/admin')
      } else {
        fetchCompanies()
      }
    } else if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, session, router])

  const handleDelete = (company: Company) => {
    setCompanyToDelete(company)
    setIsModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!companyToDelete) return

    try {
      const response = await fetch(`/api/companies/${companyToDelete.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (response.ok) {
        setCompanies(companies.filter((c) => c.id !== companyToDelete.id))
      } else {
        alert(`Erreur: ${data.error}`)
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      alert('Une erreur est survenue.')
    } finally {
      setIsModalOpen(false)
      setCompanyToDelete(null)
    }
  }

  if (status === 'loading' || loading) {
    return <Loader text="Chargement des entreprises..." />
  }

  return (
    <>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer l'entreprise "${companyToDelete?.compName}" ? Cette action est irréversible.`}
      />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestion des Entreprises</h1>
            <p className="mt-2 text-lg text-slate-600">Gérez les entreprises partenaires de la plateforme.</p>
          </div>
          <Link href="/admin/companies/create" className="mt-4 sm:mt-0 bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors inline-block">
            Ajouter une entreprise
          </Link>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="p-4 font-semibold">Entreprise</th>
                  <th className="p-4 font-semibold">Offres</th>
                  <th className="p-4 font-semibold">Recruteurs</th>
                  <th className="p-4 font-semibold">Créée le</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {companies.length > 0 ? (
                  companies.map((company) => <CompanyRow key={company.id} company={company} onDelete={handleDelete} />)
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center p-8 text-slate-500">Aucune entreprise trouvée.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
