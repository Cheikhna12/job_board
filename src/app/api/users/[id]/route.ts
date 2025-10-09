import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schéma pour la mise à jour
const updateUserSchema = z.object({
  firstname: z.string().min(2).optional(),
  lastname: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  role: z.enum(['USER', 'RECRUITER', 'ADMIN']).optional(),
  companyId: z.string().optional(),
})

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Récupère les détails d'un utilisateur
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const { id } = params

    // Permissions : ADMIN peut voir tous les utilisateurs, 
    // les autres ne peuvent voir que leur propre profil
    if (session.user.role !== 'ADMIN' && session.user.id !== id) {
      return NextResponse.json(
        { error: 'Accès refusé - Vous ne pouvez voir que votre propre profil' },
        { status: 403 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        companyId: true,
        company: {
          select: {
            id: true,
            compName: true,
            place: true,
            website: true,
          },
        },
        jobApplications: {
          select: {
            id: true,
            message: true,
            createdAt: true,
            job: {
              select: {
                id: true,
                title: true,
                company: {
                  select: {
                    compName: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        createdJobs: {
          select: {
            id: true,
            title: true,
            type: true,
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
        _count: {
          select: {
            jobApplications: true,
            createdJobs: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: user,
    })

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Modifier un utilisateur
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 example: "John"
 *               lastname:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               phone:
 *                 type: string
 *                 example: "+33123456789"
 *               role:
 *                 type: string
 *                 enum: [USER, RECRUITER, ADMIN]
 *                 example: "RECRUITER"
 *               companyId:
 *                 type: string
 *                 example: "cm1z8company123"
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const { id } = params
    const body = await request.json()
    const validatedData = updateUserSchema.parse(body)

    // Permissions complexes pour la modification
    const isAdmin = session.user.role === 'ADMIN'
    const isOwnProfile = session.user.id === id

    if (!isAdmin && !isOwnProfile) {
      return NextResponse.json(
        { error: 'Accès refusé - Vous ne pouvez modifier que votre propre profil' },
        { status: 403 }
      )
    }

    // Vérifier que l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { id },
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Restrictions pour les utilisateurs non-admin
    if (!isAdmin) {
      // Un utilisateur normal ne peut pas changer son rôle
      if (validatedData.role && validatedData.role !== existingUser.role) {
        return NextResponse.json(
          { error: 'Vous ne pouvez pas modifier votre rôle' },
          { status: 403 }
        )
      }

      // Un utilisateur normal ne peut pas changer son companyId
      if (validatedData.companyId !== undefined && validatedData.companyId !== existingUser.companyId) {
        return NextResponse.json(
          { error: 'Vous ne pouvez pas modifier votre entreprise' },
          { status: 403 }
        )
      }
    }

    // Si un email est fourni, vérifier qu'il n'existe pas déjà
    if (validatedData.email && validatedData.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: validatedData.email },
      })

      if (emailExists) {
        return NextResponse.json(
          { error: 'Un utilisateur avec cet email existe déjà' },
          { status: 409 }
        )
      }
    }

    // Si un companyId est fourni, vérifier qu'elle existe
    if (validatedData.companyId) {
      const company = await prisma.company.findUnique({
        where: { id: validatedData.companyId },
      })

      if (!company) {
        return NextResponse.json(
          { error: 'Entreprise non trouvée' },
          { status: 404 }
        )
      }
    }

    // Mise à jour de l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id },
      data: validatedData,
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        companyId: true,
        company: {
          select: {
            id: true,
            compName: true,
            place: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'Utilisateur modifié avec succès',
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Erreur lors de la modification de l\'utilisateur:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur (ADMIN seulement)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    // Seuls les ADMIN peuvent supprimer des utilisateurs
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès refusé - Rôle ADMIN requis' },
        { status: 403 }
      )
    }

    const { id } = params

    // Empêcher l'auto-suppression
    if (session.user.id === id) {
      return NextResponse.json(
        { error: 'Vous ne pouvez pas supprimer votre propre compte' },
        { status: 400 }
      )
    }

    // Vérifier que l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { id },
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Suppression de l'utilisateur (les relations sont gérées par Prisma)
    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Utilisateur supprimé avec succès',
    })

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
