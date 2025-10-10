import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { headers } from 'next/headers'

// NOTE: Données factices. Une implémentation réelle utiliserait un appel API.

// Définir un type pour l'objet utilisateur
interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: 'ADMIN' | 'RECRUITER' | 'USER';
  company?: {
    compName: string;
  };
  createdAt: string;
}

const UserRow = ({ user }: { user: User }) => (
  <tr className="border-b border-slate-200 hover:bg-slate-50">
    <td className="p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-200 border border-slate-300 rounded-full flex items-center justify-center">
          <span className="font-semibold text-slate-600">{user.firstname.charAt(0)}{user.lastname.charAt(0)}</span>
        </div>
        <div>
          <div className="font-bold text-slate-900">{user.firstname} {user.lastname}</div>
          <div className="text-sm text-slate-500">{user.email}</div>
        </div>
      </div>
    </td>
    <td className="p-4">
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'ADMIN' ? 'bg-red-100 text-red-800' : user.role === 'RECRUITER' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'}`}>
        {user.role}
      </span>
    </td>
    <td className="p-4 text-slate-600">{user.company?.compName || 'N/A'}</td>
    <td className="p-4 text-slate-600">{new Date(user.createdAt).toLocaleDateString('fr-FR')}</td>
    <td className="p-4 text-right">
      <div className="flex justify-end gap-2">
        <button className="text-sm font-semibold text-slate-600 hover:text-slate-900">Modifier</button>
        <button className="text-sm font-semibold text-red-600 hover:text-red-900">Supprimer</button>
      </div>
    </td>
  </tr>
)

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions)
  
  // Seuls les admins peuvent voir cette page
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/admin') // ou une page d'accès refusé
  }

  // Appel API pour récupérer les utilisateurs
  const requestHeaders = new Headers(await headers());
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/users`, {
    cache: 'no-store',
    headers: requestHeaders,
  });

  if (!response.ok) {
    // Gérer l'erreur, par exemple en affichant un message à l'utilisateur
    // Pour l'instant, nous allons simplement logguer l'erreur côté serveur
    console.error(`Erreur API: ${response.status} ${response.statusText}`);
    const errorBody = await response.text();
    console.error('Détails de l\'erreur:', errorBody);
    // Retourner une liste vide pour éviter de faire planter la page
    return <div>Erreur lors du chargement des utilisateurs.</div>;
  }

  const usersData = await response.json();
  const users: User[] = usersData.data || [];

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Utilisateurs</h1>
          <p className="mt-2 text-lg text-slate-600">Gérez les membres de la plateforme et leurs permissions.</p>
        </div>
        <button className="mt-4 sm:mt-0 bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors">
          Ajouter un utilisateur
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="p-4 font-semibold">Utilisateur</th>
                <th className="p-4 font-semibold">Rôle</th>
                <th className="p-4 font-semibold">Entreprise</th>
                <th className="p-4 font-semibold">Inscrit le</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => <UserRow key={user.id} user={user} />)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
