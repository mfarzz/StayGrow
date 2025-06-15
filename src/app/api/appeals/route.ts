import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';
import { AppealStatus } from '@/generated/prisma';

// GET /api/appeals - Get all appeals for the current user or admin
export async function GET(req: NextRequest) {
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

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let appeals;

    if (userRole === 'ADMIN') {
      // Admin dapat melihat semua appeals
      appeals = await prisma.projectAppeal.findMany({
        where: status ? { status: status as AppealStatus } : {},
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
        },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      // User hanya dapat melihat appeals mereka sendiri
      appeals = await prisma.projectAppeal.findMany({
        where: {
          userId: userId,
          ...(status ? { status: status as AppealStatus } : {})
        },
        include: {
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
        },
        orderBy: { createdAt: 'desc' }
      });
    }

    return NextResponse.json(appeals);
  } catch (error) {
    console.error('Error fetching appeals:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/appeals - Create a new appeal
export async function POST(req: NextRequest) {
  try {
    const headersList = await headers();
    const isAuthenticated = headersList.get('x-user-authenticated') === 'true';
    const userId = headersList.get('x-user-id');

    if (!isAuthenticated || !userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { projectId, reason } = await req.json();

    if (!projectId || !reason) {
      return NextResponse.json(
        { error: 'Project ID and reason are required' },
        { status: 400 }
      );
    }

    // Cek apakah project ada dan dimiliki oleh user
    const project = await prisma.showcaseProject.findFirst({
      where: {
        id: projectId,
        userId: userId
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found or not owned by user' },
        { status: 404 }
      );
    }

    // Cek apakah project dalam status FLAGGED
    if (project.status !== 'FLAGGED') {
      return NextResponse.json(
        { error: 'Appeals can only be created for flagged projects' },
        { status: 400 }
      );
    }

    // Cek apakah sudah ada appeal yang masih aktif untuk project ini
    const existingAppeal = await prisma.projectAppeal.findFirst({
      where: {
        userId: userId,
        projectId,
        status: {
          in: ['OPEN', 'IN_PROGRESS']
        }
      }
    });

    if (existingAppeal) {
      return NextResponse.json(
        { error: 'An active appeal already exists for this project' },
        { status: 409 }
      );
    }

    // Buat appeal baru
    const appeal = await prisma.projectAppeal.create({
      data: {
        userId: userId,
        projectId,
        reason,
        status: 'OPEN'
      },
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
          }
        }
      }
    });

    // Buat initial message dari user
    await prisma.appealMessage.create({
      data: {
        appealId: appeal.id,
        senderId: userId,
        message: reason,
        isAdminMessage: false
      }
    });

    return NextResponse.json(appeal, { status: 201 });
  } catch (error) {
    console.error('Error creating appeal:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
