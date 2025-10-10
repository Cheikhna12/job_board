'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface CompanyData {
  compName: string;
  place: string;
  information?: string;
  website?: string;
}

export default function EditCompanyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const companyId = params.id as string;

  const [formData, setFormData] = useState<CompanyData>({ compName: '', place: '', information: '', website: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
      fetchCompany();
    } else if (status === 'authenticated') {
      setError('Accès refusé. Seuls les administrateurs peuvent modifier les entreprises.');
      setLoading(false);
    } else if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, session, companyId, router]);

  const fetchCompany = async () => {
    try {
      const response = await fetch(`/api/companies/${companyId}`);
      if (response.ok) {
        const result = await response.json();
        setFormData(result.data);
      } else {
        setError('Impossible de charger les données de l\'entreprise');
      }
    } catch (err) {
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/companies/${companyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess('Entreprise mise à jour avec succès !');
        setTimeout(() => {
          router.push('/admin/companies');
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.error || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      setError('Erreur lors de la mise à jour de l\'entreprise');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (session?.user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Accès non autorisé</h1>
          <p className="text-slate-600 mb-6">Vous devez être administrateur pour accéder à cette page.</p>
          <Link href="/admin" className="text-slate-600 hover:text-slate-900 font-semibold">
            ← Retour au tableau de bord
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/admin" className="hover:text-slate-900">Dashboard</Link>
          <span>/</span>
          <Link href="/admin/companies" className="hover:text-slate-900">Entreprises</Link>
          <span>/</span>
          <span className="font-semibold text-slate-800">Modifier</span>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Modifier l'entreprise</h1>
          <p className="text-lg text-slate-600">Mettez à jour les informations de l'entreprise.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <p className="text-green-800 font-medium">{success}</p>
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Nom de l'entreprise *</label>
                <input name="compName" type="text" value={formData.compName} onChange={handleChange} required className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Lieu *</label>
                <input name="place" type="text" value={formData.place} onChange={handleChange} required className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Site web</label>
              <input name="website" type="url" value={formData.website} onChange={handleChange} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Informations</label>
              <textarea name="information" value={formData.information} onChange={handleChange} rows={5} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500" />
            </div>
            <div className="flex gap-4 pt-6">
              <Link href="/admin/companies" className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-semibold text-center transition-colors">Annuler</Link>
              <button type="submit" disabled={saving} className="flex-1 bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50">{saving ? 'Sauvegarde...' : 'Sauvegarder'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
