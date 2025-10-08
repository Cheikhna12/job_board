import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema de validation pour créer une entreprise (basé sur le vrai schéma Prisma)
const createCompanySchema = z.object({
  compName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  place: z.string().min(1, 'Le lieu est requis'),
  information: z.string().optional(),
  website: z.string().url('URL invalide').optional(),
})

// GET /api/companies - Liste toutes les entreprises
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * limit

    // Construire la condition de recherche
    const whereCondition = search
      ? {
          OR: [
            { compName: { contains: search, mode: 'insensitive' as const } },
            { information: { contains: search, mode: 'insensitive' as const } },
            { place: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}

    // Récupérer les entreprises avec pagination
    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: { compName: 'asc' },
        include: {
          _count: {
            select: {
              jobs: true,
              users: true,
            },
          },
        },
      }),
      prisma.company.count({ where: whereCondition }),
    ])

    return NextResponse.json({
      success: true,
      data: companies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des entreprises:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// POST /api/companies - Créer une nouvelle entreprise (ADMIN seulement)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Vérifier l'authentification et les permissions
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Accès refusé. Seuls les administrateurs peuvent créer des entreprises.' },
        { status: 403 }
      )
    }

    const body = await request.json()

    // Valider les données
    const validatedData = createCompanySchema.parse(body)

    // Vérifier si l'entreprise existe déjà (par nom seulement car pas d'email dans le schéma)
    const existingCompany = await prisma.company.findFirst({
      where: {
        compName: validatedData.compName,
      },
    })

    if (existingCompany) {
      return NextResponse.json(
        { success: false, error: 'Une entreprise avec ce nom existe déjà' },
        { status: 400 }
      )
    }

    // Créer l'entreprise
    const company = await prisma.company.create({
      data: validatedData,
      include: {
        _count: {
          select: {
            jobs: true,
            users: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Entreprise créée avec succès',
        data: company,
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Données invalides',
          details: error.issues,
        },
        { status: 400 }
      )
    }

    console.error('Erreur lors de la création de l\'entreprise:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
