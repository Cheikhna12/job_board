import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schéma de validation pour la création d'utilisateur
const createUserSchema = z.object({
  firstname: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastname: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  role: z.enum(['USER', 'RECRUITER', 'ADMIN']).default('USER'),
  companyId: z.string().optional(),
})

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
 * /api/users:
 *   get:
 *     summary: Liste tous les utilisateurs (ADMIN seulement)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Nombre d'éléments par page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Recherche par nom, prénom ou email
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [USER, RECRUITER, ADMIN]
 *         description: Filtrer par rôle
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Debug: Log de la session pour diagnostiquer le problème
    console.log('Session complète:', JSON.stringify(session, null, 2))
    console.log('Rôle utilisateur:', session?.user?.role)
    console.log('Type du rôle:', typeof session?.user?.role)
    
    // Seuls les ADMIN peuvent lister tous les utilisateurs
    if (!session || session.user.role !== 'ADMIN') {
      console.log('Accès refusé - Session:', !!session, 'Rôle:', session?.user?.role)
      return NextResponse.json(
        { error: 'Accès refusé - Rôle ADMIN requis' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const roleFilter = searchParams.get('role')

    const skip = (page - 1) * limit

    // Construction des filtres
    const where: any = {}
    
    if (search) {
      where.OR = [
        { firstname: { contains: search, mode: 'insensitive' } },
        { lastname: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (roleFilter && ['USER', 'RECRUITER', 'ADMIN'].includes(roleFilter)) {
      where.role = roleFilter
    }

    // Récupération des utilisateurs avec pagination
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          company: {
            select: {
              id: true,
              compName: true,
              place: true,
            },
          },
          _count: {
            select: {
              jobApplications: true,
              createdJobs: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Créer un nouvel utilisateur (ADMIN seulement)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstname
 *               - lastname
 *               - email
 *               - password
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
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "password123"
 *               role:
 *                 type: string
 *                 enum: [USER, RECRUITER, ADMIN]
 *                 default: USER
 *                 example: "USER"
 *               companyId:
 *                 type: string
 *                 example: "cm1z8company123"
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Seuls les ADMIN peuvent créer des utilisateurs
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès refusé - Rôle ADMIN requis' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = createUserSchema.parse(body)

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un utilisateur avec cet email existe déjà' },
        { status: 409 }
      )
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

    // Hash du mot de passe
    const bcrypt = require('bcryptjs')
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    // Création de l'utilisateur
    const newUser = await prisma.user.create({
      data: {
        ...validatedData,
        password: hashedPassword,
      },
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
      data: newUser,
      message: 'Utilisateur créé avec succès',
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Erreur lors de la création de l\'utilisateur:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
