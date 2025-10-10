import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const location = searchParams.get('location');

    const where: any = {
      status: 'PUBLISHED',
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    const jobs = await prisma.job.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        company: {
          select: {
            compName: true,
          },
        },
        _count: {
          select: {
            jobApplications: true,
          },
        },
      },
    });
    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des offres" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "RECRUITER" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const data = await req.json();
    const { title, type, shortDescription, description, responsibilities, qualifications, salary, location, companyId } = data;

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
        responsibilities,
        qualifications,
        salary: Number(salary) || 0,
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
 