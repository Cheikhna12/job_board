"use client";

import { useEffect, useState } from "react";

type Job = { id: string; title: string };
type Application = {
  id: string;
  message: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  status: string;
  job: { id: string; title: string; company: { compName: string } };
};

const STATUSES = ["EN_ATTENTE", "ACCEPTEE", "REFUSEE"] as const;

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const [newJobId, setNewJobId] = useState<string>("");
  const [newName, setNewName] = useState<string>("");
  const [newEmail, setNewEmail] = useState<string>("");
  const [newPhone, setNewPhone] = useState<string>("");
  const [newMessage, setNewMessage] = useState<string>("");

  async function fetchApplications() {
    const res = await fetch("/api/applications");
    const data = await res.json();
    setApplications(data);
  }

  async function fetchJobs() {
    const res = await fetch("/api/jobs");
    const data = await res.json();
    setJobs(data);
    if (data.length > 0) setNewJobId(data[0].id);
  }

  useEffect(() => {
    fetchApplications();
    fetchJobs();
  }, []);

  async function updateStatus(id: string, status: typeof STATUSES[number]) {
    const res = await fetch(`/api/applications/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      fetchApplications();
    } else {
      alert("Erreur lors de la mise à jour du statut");
    }
  }

  async function submitApplication(e: React.FormEvent) {
    e.preventDefault();
    if (!newJobId || !newName || !newEmail || !newMessage) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobId: newJobId,
        applicantName: newName,
        applicantEmail: newEmail,
        applicantPhone: newPhone,
        message: newMessage,
      }),
    });

    if (res.ok) {
      setNewName("");
      setNewEmail("");
      setNewPhone("");
      setNewMessage("");
      setNewJobId(jobs[0]?.id || "");
      fetchApplications();
    } else {
      alert("Erreur lors de la création de la candidature");
    }
  }

  const filteredApplications = applications.filter((app) => {
    const matchesStatus = filterStatus ? app.status === filterStatus : true;
    const matchesSearch =
      app.applicantName.toLowerCase().includes(search.toLowerCase()) ||
      app.job.title.toLowerCase().includes(search.toLowerCase()) ||
      app.job.company.compName.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl mb-4">Gestion des candidatures</h1>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Recherche par nom, poste ou entreprise"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Tous les statuts</option>
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <button
          onClick={fetchApplications}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Actualiser
        </button>
      </div>

      <form onSubmit={submitApplication} className="mb-6 border p-4 rounded space-y-2">
        <h2 className="text-xl font-semibold mb-2">Nouvelle candidature</h2>
        <select
          value={newJobId}
          onChange={(e) => setNewJobId(e.target.value)}
          className="border p-2 rounded w-full"
        >
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Nom"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="email"
          placeholder="Email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="tel"
          placeholder="Téléphone (optionnel)"
          value={newPhone}
          onChange={(e) => setNewPhone(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <textarea
          placeholder="Message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Postuler
        </button>
      </form>

      <ul className="space-y-4">
        {filteredApplications.map((app) => (
          <li
            key={app.id}
            className="border p-4 rounded shadow flex flex-col md:flex-row md:justify-between md:items-center"
          >
            <div>
              <p className="font-semibold">{app.applicantName}</p>
              <p>{app.applicantEmail}</p>
              {app.applicantPhone && <p>Téléphone: {app.applicantPhone}</p>}
              <p>
                Poste: <strong>{app.job.title}</strong> @ {app.job.company.compName}
              </p>
              <p>Status: {app.status}</p>
            </div>

            <div className="mt-2 md:mt-0 flex gap-2">
              {STATUSES.map((status) => (
                <button
                  key={status}
                  onClick={() => updateStatus(app.id, status)}
                  className={`px-3 py-1 rounded font-semibold ${
                    app.status === status
                      ? "bg-gray-500 text-white"
                      : status === "EN_ATTENTE"
                      ? "bg-gray-300"
                      : status === "ACCEPTEE"
                      ? "bg-green-400 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>

      {filteredApplications.length === 0 && (
        <p className="text-center mt-6 text-gray-500">Aucune candidature trouvée</p>
      )}
    </div>
  );
}
