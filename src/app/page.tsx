'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

// Icônes SVG pour une touche de légèreté
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

const ArrowRightIcon = () => (
  <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
)

const PlaceholderImage = () => (
  <div className="aspect-square bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center">
    <svg className="w-1/3 h-1/3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
  </div>
)

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [locationTerm, setLocationTerm] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const query = new URLSearchParams({ search: searchTerm, location: locationTerm }).toString()
    router.push(`/jobs?${query}`)
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
            
      {/* Section Principale (Hero) */}
      <section className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                Trouvez l'expert qui transformera votre projet.
              </h1>
              <p className="mt-6 text-lg text-slate-600 max-w-xl mx-auto lg:mx-0">
                Recherchez parmi des milliers de profils qualifiés et trouvez le talent parfait pour chaque mission, du design à la programmation.
              </p>
              
              {/* Barre de recherche épurée */}
              <form onSubmit={handleSearch} className="mt-10 bg-white border border-slate-200 rounded-xl shadow-sm p-2 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto lg:mx-0">
                <div className="flex-1 flex items-center px-4">
                  <SearchIcon />
                  <input 
                    type="text" 
                    placeholder="Compétence ou titre de poste"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full ml-3 py-3 bg-transparent outline-none placeholder:text-slate-400"
                  />
                </div>
                <div className="flex-1 flex items-center px-4 border-t sm:border-t-0 sm:border-l border-slate-200">
                  <LocationIcon />
                  <input 
                    type="text" 
                    placeholder="Ville ou pays"
                    value={locationTerm}
                    onChange={(e) => setLocationTerm(e.target.value)}
                    className="w-full ml-3 py-3 bg-transparent outline-none placeholder:text-slate-400"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Rechercher
                </button>
              </form>
            </div>

            {/* Grille d'images épurée */}
            <div className="hidden lg:grid grid-cols-3 gap-4">
              <div className="space-y-4 pt-16">
                <PlaceholderImage />
                <PlaceholderImage />
              </div>
              <div className="space-y-4">
                <PlaceholderImage />
                <PlaceholderImage />
                <PlaceholderImage />
              </div>
              <div className="space-y-4 pt-24">
                <PlaceholderImage />
                <PlaceholderImage />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Catégories */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold">Les catégories les plus demandées</h2>
            <p className="mt-4 text-lg text-slate-600">Explorez les domaines où la demande est la plus forte.</p>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Design & Développement', count: '2349 postes' },
              { name: 'Marketing & Ventes', count: '1569 postes' },
              { name: 'Business & Marketing', count: '2319 postes' },
              { name: 'Programmation & Code', count: '2349 postes' },
            ].map((category) => (
              <div key={category.name} className="bg-white p-8 rounded-xl border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all">
                <h3 className="text-lg font-semibold">{category.name}</h3>
                <p className="mt-2 text-slate-500">{category.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section "Comment ça marche ?" */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="w-full h-auto aspect-video bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center">
                <svg className="w-1/4 h-1/4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold">Un monde de talents à portée de main.</h2>
              <p className="mt-6 text-lg text-slate-600">Notre processus simplifié vous permet de trouver et recruter les meilleurs profils en quelques étapes simples, avec des paiements sécurisés et une transparence totale.</p>
              <ul className="mt-8 space-y-4 text-slate-600">
                <li className="flex items-start"><span className="inline-block w-2 h-2 bg-slate-800 rounded-full mt-2 mr-3 flex-shrink-0"></span>Recherche transparente et efficace</li>
                <li className="flex items-start"><span className="inline-block w-2 h-2 bg-slate-800 rounded-full mt-2 mr-3 flex-shrink-0"></span>Recrutez les meilleurs talents</li>
                <li className="flex items-start"><span className="inline-block w-2 h-2 bg-slate-800 rounded-full mt-2 mr-3 flex-shrink-0"></span>Paiements protégés à chaque étape</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section Entreprises */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold">Reconnus par les meilleures startups</h2>
            <p className="mt-4 text-lg text-slate-600">Des entreprises innovantes nous font confiance pour trouver leurs futurs collaborateurs.</p>
          </div>

          <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
            {['Google', 'ShipBob', 'Dribbble', 'Slack', 'Vine'].map((company) => (
              <div key={company} className="text-center text-2xl font-semibold text-slate-400 grayscale hover:grayscale-0 transition-all">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Appel à l'action (CTA) */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">Prêt à trouver votre prochain talent ?</h2>
          <p className="mt-4 text-lg text-slate-600">Publiez une offre d'emploi et recevez des candidatures qualifiées en quelques heures.</p>
          <div className="mt-8">
            <Link
              href="/jobs/create"
              className="group inline-flex items-center justify-center bg-slate-800 hover:bg-slate-900 text-white px-8 py-4 rounded-xl font-semibold transition-colors"
            >
              Publier une offre
              <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
