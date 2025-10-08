"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Job = {
  id: string;
  title: string;
  type: string;
  shortDescription: string;
  location: string;
  company: { compName: string; place: string };
};

export default function JobsPage() {
  const { data: session } = useSession();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch("/api/jobs");
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        console.error("Erreur fetch jobs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  if (loading) return <p>Chargement des offres...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Liste des offres d’emploi</h1>

      {/* Кнопка создания вакансии только для EMPLOYER/ADMIN */}
      {(session?.user?.role === "EMPLOYER" || session?.user?.role === "ADMIN") && (
        <div className="mb-6">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => router.push("/jobs/create")}
          >
            Créer une offre
          </button>
        </div>
      )}

      <div className="grid gap-6">
        {jobs.map((job) => (
          <div key={job.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{job.title}</h2>
            <p className="text-gray-700">{job.shortDescription}</p>
            <p className="text-sm text-gray-500">
              {job.location}, {job.type}
            </p>
            <p className="text-sm text-gray-500">
              Entreprise: {job.company.compName} ({job.company.place})
            </p>
            <div className="mt-2 flex gap-2">
              {/* Кнопка просмотра деталей для всех пользователей */}
              <button
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={() => router.push(`/jobs/${job.id}`)}
              >
                En savoir plus
              </button>

              {/* Кнопки редактирования и удаления только для EMPLOYER/ADMIN */}
              {(session?.user?.role === "EMPLOYER" || session?.user?.role === "ADMIN") && (
                <>
                  <button
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    onClick={() => router.push(`/jobs/${job.id}/edit`)}
                  >
                    Modifier
                  </button>
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={async () => {
                      if (confirm("Voulez-vous vraiment supprimer cette offre ?")) {
                        await fetch(`/api/jobs/${job.id}`, { method: "DELETE" });
                        setJobs((prev) => prev.filter((j) => j.id !== job.id));
                      }
                    }}
                  >
                    Supprimer
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
