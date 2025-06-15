import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';
import { AppealStatus } from '@/generated/prisma';

interface Props {
  params: { appealId: string };
}

// GET /api/appeals/[appealId] - Get specific appeal
export async function GET(req: NextRequest, { params }: Props) {
  try {
    const headersList = await headers();
    const isAuthenticated = headersList.get('x-user-authenticated') === 'true';
    const userId = headersList.get('x-user-id');
    const userRole = headersList.get('x-user-role');

    if (!isAuthenticated || !userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const appeal = await prisma.projectAppeal.findUnique({
      where: { id: params.appealId },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatarUrl: true }
        },
        project: {
          select: { id: true, title: true, imageUrl: true, description: true }
        },
        messages: {
          include: {
            sender: {
              select: { id: true, name: true, avatarUrl: true, role: true }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!appeal) {
      return NextResponse.json(
        { error: 'Appeal not found' },
        { status: 404 }
      );
    }

    // Cek permission: user hanya bisa lihat appeal mereka sendiri, admin bisa lihat semua
    if (userRole !== 'ADMIN' && appeal.userId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    return NextResponse.json(appeal);
  } catch (error) {
    console.error('Error fetching appeal:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/appeals/[appealId] - Update appeal status (admin only)
export async function PATCH(req: NextRequest, { params }: Props) {
  try {
    const headersList = await headers();
    const isAuthenticated = headersList.get('x-user-authenticated') === 'true';
    const userId = headersList.get('x-user-id');
    const userRole = headersList.get('x-user-role');

    if (!isAuthenticated || !userId || userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    const { status, resolution } = await req.json();

    if (!status || !['IN_PROGRESS', 'RESOLVED', 'CLOSED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const appeal = await prisma.projectAppeal.findUnique({
      where: { id: params.appealId },
      include: { project: true }
    });

    if (!appeal) {
      return NextResponse.json(
        { error: 'Appeal not found' },
        { status: 404 }
      );
    }

    const updateData: {
      status: AppealStatus;
      assignedTo: string;
      resolvedAt?: Date;
      resolution?: string;
    } = {
      status: status as AppealStatus,
      assignedTo: userId
    };

    if (status === 'RESOLVED' || status === 'CLOSED') {
      updateData.resolvedAt = new Date();
      
      if (resolution) {
        updateData.resolution = resolution;
      }

      // Jika appeal di-resolve dengan status RESOLVED, kembalikan project ke PUBLISHED
      if (status === 'RESOLVED' && appeal.project.status === 'FLAGGED') {
        await prisma.showcaseProject.update({
          where: { id: appeal.projectId },
          data: { status: 'PUBLISHED' }
        });
      }
    }

    const updatedAppeal = await prisma.projectAppeal.update({
      where: { id: params.appealId },
      data: updateData,
      include: {
        user: {
          select: { id: true, name: true, email: true, avatarUrl: true }
        },
        project: {
          select: { id: true, title: true, imageUrl: true }
        },
        messages: {
          include: {
            sender: {
              select: { id: true, name: true, avatarUrl: true, role: true }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    return NextResponse.json(updatedAppeal);
  } catch (error) {
    console.error('Error updating appeal:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
