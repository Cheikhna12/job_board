import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

import { JobStatus } from '@prisma/client';

const updateStatusSchema = z.object({
  status: z.nativeEnum(JobStatus),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = params;

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const canUpdate = session.user.role === 'ADMIN' || session.user.role === 'RECRUITER';
    if (!canUpdate) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const job = await prisma.job.findUnique({
      where: { id },
      select: { createdBy: true },
    });

    if (!job) {
      return NextResponse.json({ error: 'Offre non trouvée' }, { status: 404 });
    }

    if (session.user.role === 'RECRUITER' && job.createdBy !== session.user.id) {
      return NextResponse.json({ error: 'Vous ne pouvez modifier que vos propres offres' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = updateStatusSchema.parse(body);

    const updatedJob = await prisma.job.update({
      where: { id },
      data: { status: validatedData.status },
    });

    return NextResponse.json({ success: true, data: updatedJob });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides', details: error.issues }, { status: 400 });
    }
    console.error('Erreur lors de la mise à jour du statut:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
