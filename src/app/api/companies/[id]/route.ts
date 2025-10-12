import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema de validation pour modifier une entreprise (basé sur le vrai schéma Prisma)
const updateCompanySchema = z.object({
  compName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').optional(),
  place: z.string().min(1, 'Le lieu est requis').optional(),
  information: z.string().optional(),
  website: z.string().url('URL invalide').optional(),
})

// GET /api/companies/[id] - Détails d'une entreprise
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    // Vérifier que l'ID est valide
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID entreprise requis' },
        { status: 400 }
      )
    }

    // Récupérer l'entreprise avec ses relations
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        jobs: {
          select: {
            id: true,
            title: true,
            type: true,
            salary: true,
            location: true,
            createdAt: true,
            _count: {
              select: {
                jobApplications: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        users: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            role: true,
          },
          where: {
            role: 'RECRUITER',
          },
        },
        _count: {
          select: {
            jobs: true,
            users: true,
          },
        },
      },
    })

    if (!company) {
      return NextResponse.json(
        { success: false, error: 'Entreprise non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: company,
    })
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'entreprise:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// PUT /api/companies/[id] - Modifier une entreprise
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const session = await getServerSession(authOptions)

    // Vérifier l'authentification
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Vérifier que l'ID est valide
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID entreprise requis' },
        { status: 400 }
      )
    }

    // Vérifier si l'entreprise existe
    const existingCompany = await prisma.company.findUnique({
      where: { id },
    })

    if (!existingCompany) {
      return NextResponse.json(
        { success: false, error: 'Entreprise non trouvée' },
        { status: 404 }
      )
    }

    // Vérifier les permissions
    const canModify = 
      session.user.role === 'ADMIN' || 
      (session.user.role === 'RECRUITER' && session.user.companyId === id)

    if (!canModify) {
      return NextResponse.json(
        { success: false, error: 'Accès refusé. Vous ne pouvez modifier que votre propre entreprise.' },
        { status: 403 }
      )
    }

    const body = await request.json()

    // Valider les données
    const validatedData = updateCompanySchema.parse(body)

    // Vérifier les conflits (nom déjà utilisé par une autre entreprise)
    if (validatedData.compName) {
      const conflictingCompany = await prisma.company.findFirst({
        where: {
          AND: [
            { id: { not: id } }, // Exclure l'entreprise actuelle
            { compName: validatedData.compName },
          ],
        },
      })

      if (conflictingCompany) {
        return NextResponse.json(
          { success: false, error: 'Une autre entreprise utilise déjà ce nom' },
          { status: 400 }
        )
      }
    }

    // Mettre à jour l'entreprise
    const updatedCompany = await prisma.company.update({
      where: { id },
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

    return NextResponse.json({
      success: true,
      message: 'Entreprise modifiée avec succès',
      data: updatedCompany,
    })
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

    console.error('Erreur lors de la modification de l\'entreprise:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// DELETE /api/companies/[id] - Supprimer une entreprise (ADMIN seulement)
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
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
        { success: false, error: 'Accès refusé. Seuls les administrateurs peuvent supprimer des entreprises.' },
        { status: 403 }
      )
    }

    // Vérifier que l'ID est valide
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID entreprise requis' },
        { status: 400 }
      )
    }

    // Vérifier si l'entreprise existe
    const existingCompany = await prisma.company.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            jobs: true,
            users: true,
          },
        },
      },
    })

    if (!existingCompany) {
      return NextResponse.json(
        { success: false, error: 'Entreprise non trouvée' },
        { status: 404 }
      )
    }

    // Vérifier s'il y a des dépendances
    if (existingCompany._count.jobs > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Impossible de supprimer l'entreprise. Elle a ${existingCompany._count.jobs} offre(s) d'emploi associée(s).` 
        },
        { status: 400 }
      )
    }

    if (existingCompany._count.users > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Impossible de supprimer l'entreprise. Elle a ${existingCompany._count.users} utilisateur(s) associé(s).` 
        },
        { status: 400 }
      )
    }

    // Supprimer l'entreprise
    await prisma.company.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Entreprise supprimée avec succès',
    })
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'entreprise:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
