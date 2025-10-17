import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateUserSchema = z.object({
  firstname: z.string().min(2).optional(),
  lastname: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z.enum(['USER', 'RECRUITER', 'ADMIN']).optional(),
});

const updateOwnProfileSchema = z.object({
  firstname: z.string().min(2),
  lastname: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
});

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  if (session.user.role !== 'ADMIN' && session.user.id !== id) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  try {
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
        companyId: true,
        company: {
          select: {
            id: true,
            compName: true,
            place: true,
          }
        }
      },
    });
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  // Un utilisateur peut seulement modifier son propre profil
  if (session.user.id !== id) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const validatedData = updateOwnProfileSchema.parse(body);

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
        companyId: true,
        company: {
          select: {
            id: true,
            compName: true,
            place: true,
          }
        }
      }
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides', details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  if (session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const validatedData = updateUserSchema.parse(body);

    const updatedUser = await prisma.user.update({
      where: { id },
      data: validatedData,
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides', details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  if (session.user.id === id) {
    return NextResponse.json({ error: 'Vous ne pouvez pas supprimer votre propre compte' }, { status: 400 });
  }

  try {
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Utilisateur supprimé' });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
