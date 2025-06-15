import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin role - support both Bearer token and cookie
    let token: string | undefined;
    
    // Try Bearer token first
    const authorization = request.headers.get('authorization');
    if (authorization?.startsWith('Bearer ')) {
      token = authorization.split(' ')[1];
    } else {
      // Fallback to cookie
      token = request.cookies.get('auth-token')?.value;
    }
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    if (!(typeof decoded === 'object' && decoded && 'userId' in decoded)) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Verify admin role
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId as string },
      select: { role: true }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied. Admin role required.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions: {
      OR?: Array<{
        user?: { name?: { contains: string; mode: 'insensitive' }; email?: { contains: string; mode: 'insensitive' } };
        expertise?: { has: string };
        motivation?: { contains: string; mode: 'insensitive' };
      }>;
      status?: 'PENDING' | 'APPROVED' | 'REJECTED';
    } = {};

    if (search) {
      whereConditions.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { expertise: { has: search } },
        { motivation: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (status !== 'all') {
      whereConditions.status = status as 'PENDING' | 'APPROVED' | 'REJECTED';
    }

    // Get mentor applications with pagination
    const [applications, totalCount] = await Promise.all([
      prisma.mentorApplication.findMany({
        where: whereConditions,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
              location: true
            }
          }
        }
      }),
      prisma.mentorApplication.count({ where: whereConditions })
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      applications,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching mentor applications:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Check authentication and admin role
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    if (!(typeof decoded === 'object' && decoded && 'userId' in decoded)) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Verify admin role
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId as string },
      select: { role: true }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied. Admin role required.' }, { status: 403 });
    }

    const body = await request.json();
    const { applicationId, action, data } = body;

    if (!applicationId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let result;

    switch (action) {
      case 'approve':
        // Update application status and user role
        result = await prisma.$transaction(async (tx) => {
          const application = await tx.mentorApplication.update({
            where: { id: applicationId },
            data: { 
              status: 'APPROVED',
              reviewedAt: new Date(),
              adminNotes: data?.reviewNote || null,
              reviewedBy: decoded.userId as string
            },
            include: { user: true }
          });

          // Update user role to MENTOR
          await tx.user.update({
            where: { id: application.userId },
            data: { role: 'MENTOR' }
          });

          return application;
        });
        break;

      case 'reject':
        result = await prisma.mentorApplication.update({
          where: { id: applicationId },
          data: { 
            status: 'REJECTED',
            reviewedAt: new Date(),
            adminNotes: data?.reviewNote || null,
            reviewedBy: decoded.userId as string
          }
        });
        break;

      case 'pending':
        result = await prisma.mentorApplication.update({
          where: { id: applicationId },
          data: { 
            status: 'PENDING',
            reviewedAt: null,
            adminNotes: null,
            reviewedBy: null
          }
        });
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({
      message: `Application ${action} successful`,
      application: result
    });

  } catch (error) {
    console.error('Error updating mentor application:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
