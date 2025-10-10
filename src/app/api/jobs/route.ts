import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        company: true,
        creator: {
          select: { id: true, firstname: true, lastname: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(jobs);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "RECRUITER" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const data = await req.json();
    const { title, type, shortDescription, description, salary, location, companyId } = data;

    if (!title || !type || !shortDescription || !description || salary === undefined || !location || !companyId) {
      return NextResponse.json({ error: "Tous les champs obligatoires doivent être remplis" }, { status: 400 });
    }

    // Vérifier que l'entreprise existe
    const company = await prisma.company.findUnique({
      where: { id: companyId }
    });

    if (!company) {
      return NextResponse.json({ error: "Entreprise non trouvée" }, { status: 404 });
    }

    const newJob = await prisma.job.create({
      data: {
        title,
        type,
        shortDescription,
        description,
        salary: Number(salary), // приводим к числу
        location,
        companyId,
        createdBy: session.user.id,
      },
    });

    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
 