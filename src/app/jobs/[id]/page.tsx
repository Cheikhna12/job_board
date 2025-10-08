"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type JobDetail = {
  id: string;
  title: string;
  type: string;
  shortDescription: string;
  description: string;
  salary?: number;
  location: string;
  company: { compName: string; place: string; website?: string };
  creator: { firstname: string; lastname: string };
};

export default function JobDetailPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await fetch(`/api/jobs/${id}`);
        const data = await res.json();
        setJob(data);
      } catch (err) {
        console.error("Erreur fetch job:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [id]);

  if (loading) return <p>Chargement de l'offre...</p>;
  if (!job) return <p>Offre introuvable</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
      <p className="text-gray-700 mb-2">{job.shortDescription}</p>
      <p className="text-gray-600 mb-2">{job.description}</p>
      <p className="text-sm text-gray-500 mb-2">
        {job.location} — {job.type}
      </p>
      {job.salary && <p className="text-sm text-gray-500 mb-2">Salaire: {job.salary} €</p>}
      <p className="text-sm text-gray-500 mb-4">
        Entreprise: {job.company.compName} ({job.company.place})
        {job.company.website && (
          <> — <a href={job.company.website} className="text-blue-600 underline">{job.company.website}</a></>
        )}
      </p>

      {(!session || session.user.role === "APPLICANT" || session.user.role === "USER") && (
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mb-4"
          onClick={() => router.push(`/jobs/${id}/apply`)}
        >
          Postuler
        </button>
      )}
     
      {(session?.user.role === "EMPLOYER" || session?.user.role === "ADMIN") && (
        <div className="flex gap-2 mt-4">
          <button
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            onClick={() => router.push(`/jobs/${id}/edit`)}
          >
            Modifier
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={async () => {
              if (confirm("Voulez-vous vraiment supprimer cette offre ?")) {
                await fetch(`/api/jobs/${id}`, { method: "DELETE" });
                router.push("/jobs");
              }
            }}
          >
            Supprimer
          </button>
        </div>
      )}
    </div>
  );
}
