'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Loader from '@/components/ui/Loader'
import ConfirmModal from '@/components/ui/ConfirmModal'

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  company?: { compName: string };
  createdAt: string;
}

const UserRow = ({ user, onDelete }: { user: User, onDelete: (user: User) => void }) => (
  <tr className="border-b border-slate-200 hover:bg-slate-50/75">
    <td className="p-4">
      <div className="font-semibold text-slate-800">{user.firstname} {user.lastname}</div>
      <div className="text-xs text-slate-500">{user.email}</div>
    </td>
    <td className="p-4 text-slate-600 font-mono text-xs">{user.id}</td>
    <td className="p-4 text-slate-600">
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'ADMIN' ? 'bg-red-100 text-red-700' : user.role === 'RECRUITER' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
        {user.role}
      </span>
    </td>
    <td className="p-4 text-slate-600">{user.company?.compName || 'N/A'}</td>
    <td className="p-4 text-slate-600">{new Date(user.createdAt).toLocaleDateString('fr-FR')}</td>
    <td className="p-4 text-right">
      <div className="flex justify-end gap-2">
        <Link href={`/admin/users/${user.id}/edit`} className="text-sm font-semibold text-slate-600 hover:text-slate-900">Modifier</Link>
        <button onClick={() => onDelete(user)} className="text-sm font-semibold text-red-600 hover:text-red-900">Supprimer</button>
      </div>
    </td>
  </tr>
);

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data.data || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      if (session.user.role !== 'ADMIN') {
        router.push('/admin');
      } else {
        fetchUsers();
      }
    } else if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, session, router]);

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch(`/api/users/${userToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsers(users.filter((u) => u.id !== userToDelete.id));
        // Optionnel: ajouter un toast de succès ici
      } else {
        const data = await response.json();
        alert(`Erreur: ${data.error}`);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Une erreur est survenue.');
    } finally {
      setIsModalOpen(false);
      setUserToDelete(null);
    }
  };

  if (status === 'loading' || loading) {
    return <Loader text="Chargement des utilisateurs..." />;
  }

  return (
    <>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer l'utilisateur ${userToDelete?.firstname} ${userToDelete?.lastname} ? Cette action est irréversible.`}
      />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestion des Utilisateurs</h1>
            <p className="mt-2 text-lg text-slate-600">Gérez les membres de la plateforme et leurs permissions.</p>
          </div>
          <Link href="/admin/users/create" className="mt-4 sm:mt-0 bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors">
            Ajouter un utilisateur
          </Link>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="p-4 font-semibold">Utilisateur</th>
                  <th className="p-4 font-semibold">ID</th>
                  <th className="p-4 font-semibold">Rôle</th>
                  <th className="p-4 font-semibold">Entreprise</th>
                  <th className="p-4 font-semibold">Date d'inscription</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map(user => <UserRow key={user.id} user={user} onDelete={handleDelete} />)
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center p-8 text-slate-500">Aucun utilisateur trouvé.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
