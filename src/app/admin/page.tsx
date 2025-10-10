import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { headers } from 'next/headers'

// Icônes pour le dashboard
const UsersIcon = () => (
  <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
)

const BriefcaseIcon = () => (
  <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 002 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2v-8a2 2 0 012-2V6" />
  </svg>
)

const BuildingIcon = () => (
  <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
)

const StatCard = ({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-6">
    <div className="flex items-center justify-between">
      <p className="text-sm font-semibold text-slate-600">{title}</p>
      {icon}
    </div>
    <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
  </div>
)

const NavCard = ({ href, title, description }: { href: string; title: string; description: string }) => (
  <Link href={href} className="group block">
    <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all">
      <h3 className="text-lg font-bold group-hover:text-slate-900">{title}</h3>
      <p className="mt-2 text-slate-500">{description}</p>
      <div className="mt-4 font-semibold text-slate-800 group-hover:text-slate-900 flex items-center">
        Gérer
        <svg className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </div>
  </Link>
)

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'RECRUITER')) {
    redirect('/auth/login')
  }

  // Appels API pour récupérer les statistiques réelles
  const requestHeaders = new Headers(await headers());
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  const apiFetch = (url: string) => fetch(url, { cache: 'no-store', headers: requestHeaders });

  const [jobsRes, companiesRes, usersRes, applicationsRes] = await Promise.all([
    apiFetch(`${baseUrl}/api/jobs`),
    apiFetch(`${baseUrl}/api/companies`),
    apiFetch(`${baseUrl}/api/users`),
    apiFetch(`${baseUrl}/api/applications`)
  ]);

  const jobsData = await jobsRes.json();
  const companiesData = await companiesRes.json();
  const usersData = await usersRes.json();
  const applicationsData = await applicationsRes.json();

  const stats = {
    jobs: jobsData.length || 0,
    companies: companiesData.data?.length || 0,
    users: usersData.data?.length || 0,
    applications: applicationsData.length || 0
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="mt-2 text-lg text-slate-600">Bienvenue, {session.user.name}. Voici un aperçu de votre activité.</p>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard title="Postes Publiés" value={stats.jobs} icon={<BriefcaseIcon />} />
        <StatCard title="Candidatures Reçues" value={stats.applications} icon={<UsersIcon />} />
        {session.user.role === 'ADMIN' && (
          <>
            <StatCard title="Entreprises" value={stats.companies} icon={<BuildingIcon />} />
            <StatCard title="Utilisateurs" value={stats.users} icon={<UsersIcon />} />
          </>
        )}
      </div>

      {/* Cartes de navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NavCard href="/admin/jobs" title="Gérer les offres d'emploi" description="Modifiez, archivez ou supprimez les postes publiés." />
        <NavCard href="/admin/applications" title="Gérer les candidatures" description="Consultez et mettez à jour le statut des candidatures reçues." />
        {session.user.role === 'ADMIN' && (
          <>
            <NavCard href="/admin/companies" title="Gérer les entreprises" description="Ajoutez ou modifiez les informations des entreprises partenaires." />
            <NavCard href="/admin/users" title="Gérer les utilisateurs" description="Modifiez les rôles et les permissions des membres." />
          </>
        )}
      </div>
    </div>
  )
}
