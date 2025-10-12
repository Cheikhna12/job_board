import Link from 'next/link'

// Icônes SVG
const LocationIcon = () => (
  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const LinkIcon = () => (
  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
)

const PlaceholderLogo = ({ letter }: { letter: string }) => (
  <div className="w-24 h-24 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center">
    <span className="text-4xl font-bold text-slate-800">
      {letter}
    </span>
  </div>
)

export default async function CompanyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const response = await fetch(
    `http://localhost:3000/api/companies/${id}`,
    { cache: 'no-store' }
  )
  const data = await response.json()
  const company = data.data

  if (!company) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Entreprise non trouvée</h1>
          <Link href="/companies" className="text-slate-600 hover:text-slate-900 font-semibold">
            ← Retour à la liste des entreprises
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {/* En-tête de l'entreprise */}
        <div className="flex flex-col sm:flex-row items-start gap-8 mb-16">
          <PlaceholderLogo letter={company.compName.charAt(0)} />
          <div className="flex-grow">
            <h1 className="text-4xl font-bold tracking-tight">{company.compName}</h1>
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-2 text-slate-600">
              <div className="flex items-center">
                <LocationIcon />
                <span className="ml-2 font-medium">{company.place}</span>
              </div>
              {company.website && (
                <a 
                  href={company.website} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-slate-900 transition-colors"
                >
                  <LinkIcon />
                  <span className="ml-2 font-medium">Visiter le site web</span>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Colonne principale (offres d'emploi) */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Postes ouverts ({company.jobs?.length || 0})</h2>
            
            {company.jobs && company.jobs.length > 0 ? (
              <div className="space-y-6">
                {company.jobs.map((job: any) => (
                  <Link
                    key={job.id}
                    href={`/jobs/${job.id}`}
                    className="block group"
                  >
                    <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                            {job.title}
                          </h3>
                          <div className="mt-2 flex items-center gap-4 text-sm text-slate-500">
                            <span className="font-medium bg-slate-100 px-3 py-1 rounded-full">{job.type}</span>
                            <span>{job.location}</span>
                            {job.salary && <span className="font-semibold text-slate-800">{job.salary}€</span>}
                          </div>
                        </div>
                        <div className="ml-4 text-slate-400 group-hover:text-slate-800 transition-colors">
                           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                           </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-xl">
                <h3 className="text-xl font-semibold">Aucun poste ouvert pour le moment</h3>
                <p className="mt-2 text-slate-500">Consultez cette page plus tard pour de nouvelles opportunités.</p>
              </div>
            )}
          </div>

          {/* Colonne latérale (à propos) */}
          <aside className="space-y-8">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8">
              <h3 className="text-xl font-bold mb-4">À propos de {company.compName}</h3>
              <p className="text-slate-600 leading-relaxed">
                {company.information || 'Aucune information disponible sur cette entreprise.'}
              </p>
            </div>

            {company.users && company.users.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-8">
                <h3 className="text-xl font-bold mb-4">Équipe de recrutement ({company.users.length})</h3>
                <div className="space-y-4">
                  {company.users.map((user: any) => (
                    <div key={user.id} className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-200 border border-slate-300 rounded-full flex items-center justify-center">
                         <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                         </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">
                          {user.firstname} {user.lastname}
                        </p>
                        <p className="text-sm text-slate-500">
                          Recruteur
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}
