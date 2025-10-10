"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Company {
  id: string;
  compName: string;
  place: string;
}

export default function CreateJobPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    type: "CDI",
    shortDescription: "",
    description: "",
    responsibilities: "",
    qualifications: "",
    salary: "",
    location: "",
    companyId: "",
  });
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session && (session.user.role === "RECRUITER" || session.user.role === "ADMIN")) {
      fetchCompanies();
    }
  }, [session]);

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies?limit=100'); // Récupérer toutes les entreprises
      if (response.ok) {
        const result = await response.json();
        setCompanies(result.data);
        // Pré-sélectionner l'entreprise de l'utilisateur si elle existe
        if (session?.user?.companyId) {
          setFormData(prev => ({ ...prev, companyId: session.user.companyId || "" }));
        }
      } else {
        setError('Impossible de charger les entreprises');
      }
    } catch (err) {
      setError('Erreur lors du chargement des entreprises');
    } finally {
      setLoadingCompanies(false);
    }
  };

  if (!session || (session.user.role !== "RECRUITER" && session.user.role !== "ADMIN")) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Accès non autorisé</h1>
          <p className="text-slate-600 mb-6">Vous devez être recruteur ou administrateur pour créer une offre d'emploi.</p>
          <Link href="/jobs" className="text-slate-600 hover:text-slate-900 font-semibold">
            ← Retour aux offres
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, salary: parseFloat(formData.salary) || null }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push(`/jobs/${data.id}`);
      } else {
        setError(data.error || "Erreur serveur");
      }
    } catch (err) {
      console.error(err);
      setError("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        {/* Fil d'Ariane */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/jobs" className="hover:text-slate-900">Toutes les offres</Link>
          <span>/</span>
          <span className="font-semibold text-slate-800">Créer une offre</span>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Créer une nouvelle offre d'emploi</h1>
          <p className="text-lg text-slate-600">Publiez votre offre d'emploi et trouvez les meilleurs talents.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Titre du poste *
                </label>
                <input
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Développeur Full Stack"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Type de contrat *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                >
                  <option value="CDI">CDI</option>
                  <option value="CDD">CDD</option>
                  <option value="Stage">Stage</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Localisation *
                </label>
                <input
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Paris, France"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Salaire annuel (optionnel)
                </label>
                <input
                  name="salary"
                  type="number"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="Ex: 45000"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Entreprise *
                </label>
                {loadingCompanies ? (
                  <div className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-500">
                    Chargement des entreprises...
                  </div>
                ) : (
                  <select
                    name="companyId"
                    value={formData.companyId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  >
                    <option value="">Sélectionnez une entreprise</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.compName} - {company.place}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Résumé du poste *
              </label>
              <input
                name="shortDescription"
                type="text"
                value={formData.shortDescription}
                onChange={handleChange}
                required
                placeholder="Une description courte et accrocheuse du poste"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Description complète *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={8}
                placeholder="Décrivez en détail le poste, les responsabilités, les qualifications requises, etc."
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Responsabilités
              </label>
              <textarea
                name="responsibilities"
                value={formData.responsibilities}
                onChange={handleChange}
                rows={5}
                placeholder="Listez les principales responsabilités du poste..."
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Qualifications
              </label>
              <textarea
                name="qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                rows={5}
                placeholder="Listez les qualifications et compétences requises..."
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-4 pt-6">
              <Link
                href="/jobs"
                className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-semibold text-center transition-colors"
              >
                Annuler
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Création en cours..." : "Publier l'offre"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
