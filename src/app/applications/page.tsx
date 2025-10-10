"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface JobApplication {
  id: string;
  message: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  status: string;
  createdAt: string;
  job: { 
    id: string; 
    title: string; 
    company: { compName: string } 
  };
}

const STATUSES = ["EN_ATTENTE", "ACCEPTEE", "REFUSEE"] as const;

export default function ApplicationsPage() {
  const { data: session, status } = useSession();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === 'authenticated') {
      fetchApplications();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status]);

  async function fetchApplications() {
    try {
      const res = await fetch("/api/applications");
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      } else {
        setError("Impossible de charger les candidatures");
      }
    } catch (err) {
      setError("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      EN_ATTENTE: 'bg-yellow-100 text-yellow-800',
      ACCEPTEE: 'bg-green-100 text-green-800',
      REFUSEE: 'bg-red-100 text-red-800'
    }
    return styles[status as keyof typeof styles] || styles.EN_ATTENTE
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement des candidatures...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Connexion requise</h1>
          <p className="text-slate-600 mb-6">Vous devez être connecté pour voir vos candidatures.</p>
          <Link href="/auth/login" className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            Se connecter
          </Link>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Erreur</h1>
          <p className="text-slate-600 mb-6">{error}</p>
          <button 
            onClick={fetchApplications}
            className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
        {/* Fil d'Ariane */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/" className="hover:text-slate-900">Accueil</Link>
          <span>/</span>
          <span className="font-semibold text-slate-800">Mes candidatures</span>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Mes candidatures</h1>
          <p className="text-lg text-slate-600">Suivez l'état de vos candidatures aux offres d'emploi.</p>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📄</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Aucune candidature</h3>
            <p className="text-slate-600 mb-6">Vous n'avez pas encore postulé à d'offres d'emploi.</p>
            <Link
              href="/jobs"
              className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Parcourir les offres
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <div key={application.id} className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">
                          <Link 
                            href={`/jobs/${application.job.id}`}
                            className="hover:text-slate-600"
                          >
                            {application.job.title}
                          </Link>
                        </h3>
                        <p className="text-slate-600 font-medium">{application.job.company.compName}</p>
                      </div>
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge(application.status)}`}>
                        {application.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-semibold text-slate-700">Candidat :</span>
                        <p className="text-slate-900">{application.applicantName}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">Email :</span>
                        <p className="text-slate-900">{application.applicantEmail}</p>
                      </div>
                      {application.applicantPhone && (
                        <div>
                          <span className="font-semibold text-slate-700">Téléphone :</span>
                          <p className="text-slate-900">{application.applicantPhone}</p>
                        </div>
                      )}
                      <div>
                        <span className="font-semibold text-slate-700">Candidature envoyée :</span>
                        <p className="text-slate-900">{new Date(application.createdAt).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>

                    {application.message && (
                      <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                        <span className="font-semibold text-slate-700 block mb-2">Message de motivation :</span>
                        <p className="text-slate-900 text-sm leading-relaxed">{application.message}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
