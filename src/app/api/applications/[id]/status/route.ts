import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { ApplicationStatus } from '@prisma/client';

const updateStatusSchema = z.object({
  status: z.nativeEnum(ApplicationStatus),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = params;

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'RECRUITER')) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = updateStatusSchema.parse(body);

    // TODO: Ajouter une vérification pour s'assurer qu'un recruteur ne peut modifier que les candidatures de ses propres offres.

    const updatedApplication = await prisma.jobApplication.update({
      where: { id },
      data: { status: validatedData.status },
    });

    return NextResponse.json({ success: true, data: updatedApplication });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides', details: error.issues }, { status: 400 });
    }
    console.error('Erreur lors de la mise à jour du statut:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
