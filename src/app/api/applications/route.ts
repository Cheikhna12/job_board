import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const where =
      session.user.role === "ADMIN" || session.user.role === "RECRUITER"
        ? {}
        : { userId: session.user.id };

    const applications = await prisma.jobApplication.findMany({
      where,
      include: {
        job: {
          select: { id: true, title: true, company: { select: { compName: true } } },
        },
        user: {
          select: { id: true, firstname: true, lastname: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error("Erreur GET /applications:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  try {
    const data = await req.json();
    const { jobId, message, applicantName, applicantEmail, applicantPhone } = data;

    if (!jobId || !message || !applicantName || !applicantEmail) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    // Vérifier si une candidature existe déjà
    let whereClause: any = { jobId, applicantEmail };
    if (session?.user?.id) {
      whereClause = { jobId, userId: session.user.id };
    }

    const existingApplication = await prisma.jobApplication.findFirst({
      where: whereClause,
    });

    if (existingApplication) {
      return NextResponse.json({ error: 'Vous avez déjà postulé à cette offre.' }, { status: 409 });
    }

    const application = await prisma.jobApplication.create({
      data: {
        jobId,
        message,
        applicantName,
        applicantEmail,
        applicantPhone: applicantPhone || null,
        userId: session?.user?.id ?? null,
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("Erreur POST /applications:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
