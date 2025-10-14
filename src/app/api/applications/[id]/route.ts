import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type JobApplicationStatus = "EN_ATTENTE" | "ACCEPTEE" | "REFUSEE";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "RECRUITER" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const data = await req.json();
    const { status } = data;

    if (!status) {
      return NextResponse.json({ error: "Statut manquant" }, { status: 400 });
    }

    const validStatuses: JobApplicationStatus[] = ["EN_ATTENTE", "ACCEPTEE", "REFUSEE"];

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
    }

    const statusEnum: JobApplicationStatus = status;

    const updated = await prisma.jobApplication.update({
      where: { id: params.id },
      data: { status: statusEnum },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erreur PUT /applications/[id]:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const existing = await prisma.jobApplication.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Candidature introuvable" },
        { status: 404 }
      );
    }

    await prisma.jobApplication.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Candidature supprimée avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur DELETE /applications/[id]:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}