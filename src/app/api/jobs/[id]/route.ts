import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const job = await prisma.job.findUnique({
      where: { id: params.id },
      include: { company: true, creator: true, jobApplications: true },
    });

    if (!job) {
      return NextResponse.json({ error: "Offre non trouvée" }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error("Erreur GET /jobs/[id]:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

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
    const updatedJob = await prisma.job.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error("Erreur PUT /jobs/[id]:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "RECRUITER")) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    await prisma.jobApplication.deleteMany({
      where: { jobId: params.id },
    });

    await prisma.job.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "Offre supprimée" });
  } catch (error) {
    console.error("Erreur DELETE /jobs/[id]:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
