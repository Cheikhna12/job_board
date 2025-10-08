"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type JobForm = {
    title: string;
    type: string;
    shortDescription: string;
    description: string;
    salary: number;
    location: string;
};

export default function EditJobPage() {
    const { id } = useParams();
    const router = useRouter();
    const [job, setJob] = useState<JobForm>({
        title: "",
        type: "CDI",
        shortDescription: "",
        description: "",
        salary: 0,
        location: "",
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchJob() {
            const res = await fetch(`/api/jobs/${id}`);
            const data = await res.json();
            setJob({
                title: data.title,
                type: data.type,
                shortDescription: data.shortDescription,
                description: data.description,
                salary: data.salary,
                location: data.location,
            });
            setLoading(false);
        }
        fetchJob();
    }, [id]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const res = await fetch(`/api/jobs/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(job),
        });
        if (res.ok) {
            router.push(`/jobs/${id}`);
        } else {
            const err = await res.json();
            alert(err.error);
        }
    }

    if (loading) return <p>Chargement...</p>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Modifier l'offre</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
                <input
                    type="text"
                    placeholder="Titre"
                    value={job.title}
                    onChange={(e) => setJob({ ...job, title: e.target.value })}
                    required
                />
                <select
                    value={job.type}
                    onChange={(e) => setJob({ ...job, type: e.target.value })}
                >
                    <option value="CDI">CDI</option>
                    <option value="CDD">CDD</option>
                    <option value="Stage">Stage</option>
                    <option value="Freelance">Freelance</option>
                </select>
                <textarea
                    placeholder="Description courte"
                    value={job.shortDescription}
                    onChange={(e) => setJob({ ...job, shortDescription: e.target.value })}
                    required
                />
                <textarea
                    placeholder="Description complète"
                    value={job.description}
                    onChange={(e) => setJob({ ...job, description: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Salaire"
                    value={job.salary}
                    onChange={(e) => setJob({ ...job, salary: Number(e.target.value) })}
                    required
                />
                <input
                    type="text"
                    placeholder="Localisation"
                    value={job.location}
                    onChange={(e) => setJob({ ...job, location: e.target.value })}
                    required
                />

                <div className="flex gap-2 mt-4">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Enregistrer
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                        onClick={() => router.push(`/jobs/${id}`)}
                    >
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    );
}
