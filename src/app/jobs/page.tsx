import Link from 'next/link'

// Icônes
const SearchIcon = () => (
  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const LocationIcon = () => (
  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

// Définir un type pour l'objet job
interface Job {
  id: string;
  title: string;
  company: {
    compName: string;
  };
  type: string;
  location: string;
  salary?: number | string;
  createdAt: string;
}

async function getJobs(): Promise<Job[]> {
  try {
    const response = await fetch('http://localhost:3000/api/jobs', {
      cache: 'no-store' // Pour toujours avoir les données à jour
    })
    if (!response.ok) return []
    return response.json()
  } catch (error) {
    console.error("Impossible de récupérer les offres d'emploi:", error)
    return []
  }
}

export default async function JobsPage() {
  const jobs = await getJobs()

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {/* En-tête et recherche */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Toutes les offres d'emploi</h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Trouvez l'opportunité qui correspond à vos ambitions parmi nos offres soigneusement sélectionnées.
          </p>
        </div>

        {/* Filtres */}
        <div className="mb-12 bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Titre du poste, compétence..."
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <LocationIcon />
              </div>
              <input
                type="text"
                placeholder="Lieu"
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800"
              />
            </div>
            <button className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Rechercher
            </button>
          </div>
        </div>

        {/* Liste des offres */}
        <div className="space-y-6">
          {jobs.map((job: Job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="block group"
            >
              <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <div className="w-16 h-16 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-slate-800">
                      {job.company.compName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-xl font-bold group-hover:text-slate-900 transition-colors">
                      {job.title}
                    </h2>
                    <p className="mt-1 text-slate-600">{job.company.compName}</p>
                    <div className="mt-3 flex items-center gap-4 text-sm text-slate-500">
                      <span className="font-medium bg-slate-100 px-3 py-1 rounded-full">{job.type}</span>
                      <span>{job.location}</span>
                      {job.salary && <span className="font-semibold text-slate-800">{job.salary}€</span>}
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0 flex flex-col items-start sm:items-end justify-between h-full">
                    <p className="text-sm text-slate-400">Publiée le {new Date(job.createdAt).toLocaleDateString('fr-FR')}</p>
                    <div className="mt-4 text-slate-400 group-hover:text-slate-800 transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {jobs.length === 0 && (
          <div className="text-center py-24 border-2 border-dashed border-slate-200 rounded-xl">
            <h3 className="text-xl font-semibold">Aucune offre d'emploi pour le moment</h3>
            <p className="mt-2 text-slate-500">Revenez bientôt pour découvrir de nouvelles opportunités.</p>
          </div>
        )}
      </div>
    </div>
  )
}
