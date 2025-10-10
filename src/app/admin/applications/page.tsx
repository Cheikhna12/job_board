import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

// Définir un type pour l'objet application
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

async function getApplications(): Promise<Application[]> {
  try {
    const response = await fetch('http://localhost:3000/api/applications', { cache: 'no-store' });
    if (!response.ok) return [];
    return response.json();
  } catch (error) {
    console.error("Impossible de récupérer les candidatures:", error);
    return [];
  }
}

const ApplicationRow = ({ application }: { application: Application }) => (
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
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${application.status === 'ACCEPTEE' ? 'bg-green-100 text-green-800' : application.status === 'REFUSEE' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
        {application.status || 'EN_ATTENTE'}
      </span>
    </td>
    <td className="p-4 text-slate-600">{new Date(application.createdAt).toLocaleDateString('fr-FR')}</td>
    <td className="p-4 text-right">
      <div className="flex justify-end gap-2">
        <button className="text-sm font-semibold text-slate-600 hover:text-slate-900">Voir</button>
        <button className="text-sm font-semibold text-slate-600 hover:text-slate-900">Changer Statut</button>
      </div>
    </td>
  </tr>
)

export default async function AdminApplicationsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'RECRUITER')) {
    redirect('/auth/login')
  }

  const applications = await getApplications();

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Candidatures</h1>
        <p className="mt-2 text-lg text-slate-600">Consultez et traitez les candidatures reçues pour vos offres.</p>
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
              {applications.map((app) => <ApplicationRow key={app.id} application={app} />)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
