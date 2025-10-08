"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function CreateJobPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    type: "CDI",
    shortDescription: "",
    description: "",
    salary: "",
    location: "",
    companyId: "", // можно подставить companyId пользователя RECRUITER
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!session || (session.user.role !== "RECRUITER" && session.user.role !== "ADMIN")) {
    return <p>Non autorisé</p>;
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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Créer une nouvelle offre</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
        <input name="title" placeholder="Titre" value={formData.title} onChange={handleChange} required className="border p-2 rounded"/>
        <select name="type" value={formData.type} onChange={handleChange} className="border p-2 rounded">
          <option value="CDI">CDI</option>
          <option value="CDD">CDD</option>
          <option value="Stage">Stage</option>
          <option value="Freelance">Freelance</option>
        </select>
        <input name="shortDescription" placeholder="Résumé" value={formData.shortDescription} onChange={handleChange} required className="border p-2 rounded"/>
        <textarea name="description" placeholder="Description complète" value={formData.description} onChange={handleChange} required className="border p-2 rounded"/>
        <input name="salary" placeholder="Salaire (optionnel)" value={formData.salary} onChange={handleChange} className="border p-2 rounded"/>
        <input name="location" placeholder="Lieu" value={formData.location} onChange={handleChange} required className="border p-2 rounded"/>
        <input name="companyId" placeholder="Company ID" value={formData.companyId} onChange={handleChange} required className="border p-2 rounded"/>
        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {loading ? "Création..." : "Créer l'offre"}
        </button>
      </form>
    </div>
  );
}
