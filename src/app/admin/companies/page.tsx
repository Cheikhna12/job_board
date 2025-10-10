import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

// Définir un type pour l'objet company
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

async function getCompanies(): Promise<Company[]> {
  try {
    const response = await fetch('http://localhost:3000/api/companies', { cache: 'no-store' });
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Impossible de récupérer les entreprises:", error);
    return [];
  }
}

const CompanyRow = ({ company }: { company: Company }) => (
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
        <button className="text-sm font-semibold text-slate-600 hover:text-slate-900">Modifier</button>
        <button className="text-sm font-semibold text-red-600 hover:text-red-900">Supprimer</button>
      </div>
    </td>
  </tr>
)

export default async function AdminCompaniesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/admin')
  }

  const companies = await getCompanies();

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Entreprises</h1>
          <p className="mt-2 text-lg text-slate-600">Gérez les entreprises partenaires de la plateforme.</p>
        </div>
        <button className="mt-4 sm:mt-0 bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors">
          Ajouter une entreprise
        </button>
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
              {companies.map((company) => <CompanyRow key={company.id} company={company} />)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
