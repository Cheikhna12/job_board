'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Loader from '@/components/ui/Loader'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'

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

const ProfileImage = ({ src }: { src: string }) => (
  <div className="aspect-square rounded-full overflow-hidden border-2 border-slate-200">
    <img 
      src={src} 
      alt="Professional profile" 
      className="w-full h-full object-cover"
    />
  </div>
)

const words = [
  { text: "évoluez", color: "bg-red-500", delay: "0s" },
  { text: "explorez", color: "bg-lime-700", delay: "3s" },
  { text: "brillez", color: "bg-indigo-700", delay: "6s" },
  { text: "avancez", color: "bg-fuchsia-800", delay: "9s" },
];

const TitleAnimation = () => (
  <span className="relative inline-block h-12 w-40 sm:h-12 sm:w-55 lg:h-19 lg:w-70 ml-2 overflow-hidden align-bottom">
    {words.map((word, i) => (
      <span
        key={i}
        className={`absolute top-0 left-0 inline-block px-2 text-white box-decoration-slice animate-slide-words ${word.color}`}
        style={{ animationDelay: word.delay }}
      >
        {word.text}
      </span>
    ))}
  </span>
);

const CompanyCarousel = () => {
  const companies = [
    { name: 'Google', logo: '/logos/Google.png' },
    { name: 'Microsoft', logo: '/logos/Microsoft.png' },
    { name: 'Slack', logo: '/logos/Slack.png' },
    { name: 'Shopify', logo: '/logos/Shopify.png' },
    { name: 'Stripe', logo: '/logos/Stripe.png' },
    { name: 'Airbnb', logo: '/logos/Airbnb.png' },
    { name: 'Spotify', logo: '/logos/Spotify.png' },
    { name: 'Netflix', logo: '/logos/Netflix.png' },
  ];

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1536 }, items: 5 },
    desktop: { breakpoint: { max: 1536, min: 1024 }, items: 4 },
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 3 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 2 },
  };

  return (
    <Carousel
      responsive={responsive}
      infinite={true}
      autoPlay={true}
      autoPlaySpeed={2000}
      keyBoardControl={true}
      showDots={false}
      arrows={true}
      containerClass="px-1"
      itemClass="flex justify-center"
    >
      {companies.map((company) => (
        <div 
          key={company.name} 
          className="flex items-center justify-center p-10 bg-white rounded-lg border border-slate-200 transition delay-80 duration-400 ease-in-out hover:shadow-md hover:scale-105 grayscale hover:grayscale-0"
        >
          <img src={company.logo} alt={company.name} className="max-h-16 w-auto object-contain" />
        </div>
      ))}
    </Carousel>
  );
};

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
    return <Loader text="Chargement de la session..." />;
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
            
      {/* Section Principale (Hero) */}
      <section className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-4xl lg:text-6xl font-bold tracking-tight leading-tight text-center">
                Trouvez, postulez,<span><TitleAnimation /></span>
              </h1>
              <p className="mt-6 text-lg text-slate-600 max-w-xl mx-auto lg:mx-0">
                Recherchez parmi des milliers d'offres alléchantes et de profils qualifiés.
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
                <ProfileImage src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop" />
                <ProfileImage src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop" />
              </div>
              <div className="space-y-4">
                <ProfileImage src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop" />
                <ProfileImage src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop" />
                <ProfileImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" />
              </div>
              <div className="space-y-4 pt-24">
                <ProfileImage src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop" />
                <ProfileImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Catégories
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
      */}

      {/* Section "Comment ça marche ?" */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="w-full h-auto aspect-video bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=450&fit=crop" 
                  alt="Équipe professionnelle en réunion" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-center">Un monde d’opportunités, à portée de main.</h2>
              <p className="mt-6 text-lg text-slate-600 text-justify">
                Sur PortailJob, tout est pensé pour vous faire gagner du temps. <span className='font-normal underline decoration-blue-700 decoration-3'>Créez</span> votre profil, <span className='font-normal underline decoration-blue-700 decoration-3'>explorez</span> les offres ou les profils disponibles, <span className='font-normal underline decoration-blue-700 decoration-3'>entrez en contact</span> directement et <span className='font-normal underline decoration-blue-700 decoration-3'>collaborez</span> en toute confiance.
                Chaque étape du processus est simple, transparente et sécurisée.
              </p>
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

          <div className="mt-16">
            <CompanyCarousel />
          </div>
        </div>
      </section>

      {/* Section Appel à l'action (CTA) */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">Prêt à trouver le bon profil ?</h2>
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
