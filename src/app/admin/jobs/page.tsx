import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

// NOTE: Ce composant sera côté client pour gérer l'interactivité (filtres, suppression, etc.)
// Pour la simplicité de cette étape, il est présenté comme un Server Component avec des données statiques.

// Définir un type pour l'objet job
interface Job {
  id: string;
  title: string;
  company: {
    compName: string;
  };
  type: string;
  _count?: {
    jobApplications: number;
  };
}

const JobRow = ({ job }: { job: Job }) => (
  <tr className="border-b border-slate-200 hover:bg-slate-50">
    <td className="p-4">
      <div className="font-bold text-slate-900">{job.title}</div>
      <div className="text-sm text-slate-500">{job.company.compName}</div>
    </td>
    <td className="p-4 text-slate-600">{job.type}</td>
    <td className="p-4">
      <span className='bg-green-100 text-green-800 px-2 py-1 text-xs font-semibold rounded-full'>
        Publiée
      </span>
    </td>
    <td className="p-4 text-slate-600">{job._count?.jobApplications || 0}</td>
    <td className="p-4 text-right">
      <div className="flex justify-end gap-2">
        <Link href={`/jobs/${job.id}/edit`} className="text-sm font-semibold text-slate-600 hover:text-slate-900">Modifier</Link>
        <button className="text-sm font-semibold text-red-600 hover:text-red-900">Archiver</button>
      </div>
    </td>
  </tr>
)

export default async function AdminJobsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'RECRUITER')) {
    redirect('/auth/login')
  }

  // Appel API pour récupérer les offres
  const response = await fetch('http://localhost:3000/api/jobs', { cache: 'no-store' });
  const jobs: Job[] = await response.json();

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Offres</h1>
          <p className="mt-2 text-lg text-slate-600">Consultez, modifiez ou archivez les offres d'emploi.</p>
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
              {jobs.map(job => <JobRow key={job.id} job={job} />)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
