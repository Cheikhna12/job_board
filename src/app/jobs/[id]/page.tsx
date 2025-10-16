import Link from 'next/link'
import JobApplicationSection from '@/components/JobApplicationSection'

interface JobDetails {
  id: string;
  title: string;
  company: {
    id: string;
    compName: string;
  };
  location: string;
  description: string;
  createdAt: string;
  type: string;
  salary?: number | string;
}

async function getJobDetails(id: string): Promise<JobDetails | null> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/jobs/${id}`, {
      cache: 'no-store'
    })
    if (!response.ok) return null
    return response.json()
  } catch (error) {
    console.error("Impossible de récupérer les détails de l'offre:", error)
    return null
  }
}

export default async function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const job = await getJobDetails(id)

  if (!job) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Offre d'emploi non trouvée</h1>
          <Link href="/jobs" className="text-slate-600 hover:text-slate-900 font-semibold">
            ← Retour à la liste des offres
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {/* Fil d'Ariane */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/jobs" className="hover:text-slate-900">Toutes les offres</Link>
          <span>/</span>
          <span className="font-semibold text-slate-800">{job.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Colonne principale */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h1 className="text-4xl font-bold tracking-tight">{job.title}</h1>
              <div className="mt-4 flex items-center gap-4 text-slate-600">
                <Link href={`/companies/${job.company.id}`} className="font-bold text-slate-800 hover:underline">{job.company.compName}</Link>
                <span>·</span>
                <span>{job.location}</span>
              </div>
            </div>

            <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed">
              <h2 className="font-bold">Description du poste</h2>
              <p className='whitespace-pre-line'>{job.description}</p>
            </div>
          </div>

          {/* Colonne latérale */}
          <aside>
            <div className="sticky top-24 space-y-8">
              {/* Bouton Postuler */}
              <JobApplicationSection 
                jobId={job.id}
                jobTitle={job.title}
                createdAt={job.createdAt}
              />

              {/* Informations clés */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">Informations clés</h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start">
                    <span className="font-semibold w-24 flex-shrink-0">Contrat</span>
                    <span className="font-medium text-slate-800">{job.type}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold w-24 flex-shrink-0">Lieu</span>
                    <span className="font-medium text-slate-800">{job.location}</span>
                  </li>
                  {job.salary && (
                    <li className="flex items-start">
                      <span className="font-semibold w-24 flex-shrink-0">Salaire</span>
                      <span className="font-medium text-slate-800">{job.salary}€ / an</span>
                    </li>
                  )}
                  {/*
                  <li className="flex items-start">
                    <span className="font-semibold w-24 flex-shrink-0">Secteur</span>
                    <span className="font-medium text-slate-800">Technologie</span>
                  </li>
                  */}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
