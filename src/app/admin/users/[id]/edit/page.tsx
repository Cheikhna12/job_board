'use client'

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Loader from '@/components/ui/Loader';

function EditUserForm() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { data: session } = useSession({ required: true, onUnauthenticated: () => router.push('/auth/login') });

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('USER');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        try {
          const response = await fetch(`/api/users/${id}`);
          if (response.ok) {
            const data = await response.json();
            setFirstname(data.firstname);
            setLastname(data.lastname);
            setEmail(data.email);
            setRole(data.role);
          } else {
            setError('Utilisateur non trouvé.');
          }
        } catch (err) {
          setError('Erreur de chargement.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchUser();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstname, lastname, email, role }),
      });

      if (response.ok) {
        router.push('/admin/users');
      } else {
        const data = await response.json();
        setError(data.error || 'Erreur lors de la mise à jour.');
      }
    } catch (err) {
      setError('Une erreur inattendue est survenue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (session?.user.role !== 'ADMIN') {
    return <div className="p-8">Accès refusé.</div>;
  }

  if (isLoading) {
    return <Loader text="Chargement de l'utilisateur..." />;
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Modifier l'utilisateur</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Prénom</label>
            <input type="text" value={firstname} onChange={(e) => setFirstname(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <input type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Rôle</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3">
            <option value="USER">Utilisateur</option>
            <option value="RECRUITER">Recruteur</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => router.back()} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Annuler</button>
          <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-slate-800 text-white rounded-md text-sm font-medium hover:bg-slate-900 disabled:opacity-50">
            {isSubmitting ? 'Mise à jour...' : 'Mettre à jour'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function EditUserPage() {
  return (
    <Suspense fallback={<Loader text="Chargement du formulaire..." />}>
      <EditUserForm />
    </Suspense>
  );
}
