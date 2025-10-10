import Link from 'next/link'

// Icônes SVG
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

const BriefcaseIcon = () => (
  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 002 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2v-8a2 2 0 012-2V6" />
  </svg>
)

const PlaceholderLogo = ({ letter }: { letter: string }) => (
  <div className="w-16 h-16 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center mb-6 group-hover:bg-slate-800 transition-colors">
    <span className="text-2xl font-bold text-slate-800 group-hover:text-white transition-colors">
      {letter}
    </span>
  </div>
)

export default async function CompaniesPage() {
  const response = await fetch('http://localhost:3000/api/companies', {
    cache: 'no-store'
  })
  const data = await response.json()
  const companies = data.data || []

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
            
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {/* En-tête de la page */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Découvrez nos entreprises partenaires</h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Des startups innovantes aux grands groupes, trouvez l'environnement qui vous correspond.
          </p>
        </div>

        {/* Filtres de recherche */}
        <div className="mb-12 bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Rechercher une entreprise..."
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

        {/* Grille des entreprises */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {companies.map((company: any) => (
            <Link 
              key={company.id} 
              href={`/companies/${company.id}`}
              className="group block"
            >
              <div className="bg-white border border-slate-200 rounded-xl p-8 h-full flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all">
                <PlaceholderLogo letter={company.compName.charAt(0)} />
                
                <div className="flex-grow">
                  <h2 className="text-xl font-bold group-hover:text-slate-900 transition-colors">
                    {company.compName}
                  </h2>
                  <p className="mt-2 text-slate-500 line-clamp-3">
                    {company.information || 'Aucune description disponible.'}
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200 flex items-center justify-between">
                  <div className="flex items-center text-slate-600">
                    <BriefcaseIcon />
                    <span className="ml-2 font-semibold">{company._count?.jobs || 0} postes ouverts</span>
                  </div>
                  <div className="text-slate-400 group-hover:text-slate-800 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* État vide */}
        {companies.length === 0 && (
          <div className="text-center py-24 border-2 border-dashed border-slate-200 rounded-xl">
            <BriefcaseIcon />
            <h3 className="mt-4 text-xl font-semibold">Aucune entreprise trouvée</h3>
            <p className="mt-2 text-slate-500">Revenez bientôt pour découvrir de nouvelles opportunités.</p>
          </div>
        )}
      </div>
    </div>
  )
}
