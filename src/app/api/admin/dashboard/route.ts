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

    // Get dashboard statistics
    const [
      totalUsers,
      totalProjects,
      totalMentors,
      totalMentorshipSessions,
      recentUsers,
      recentProjects,
      monthlyStats
    ] = await Promise.all([
      // Total counts
      prisma.user.count(),
      prisma.showcaseProject.count(),
      prisma.user.count({ where: { role: 'MENTOR' } }),
      prisma.mentorApplication.count({ where: { status: 'APPROVED' } }),
      
      // Recent users (last 7 days)
      prisma.user.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          avatarUrl: true
        }
      }),
      
      // Recent projects (last 7 days)
      prisma.showcaseProject.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          user: {
            select: {
              name: true,
              avatarUrl: true
            }
          }
        }
      }),
      
      // Monthly statistics for the last 6 months - PostgreSQL syntax
      prisma.$queryRaw`
        SELECT 
          TO_CHAR(created_at, 'YYYY-MM') as month,
          COUNT(*) as count,
          'users' as type
        FROM "User" 
        WHERE created_at >= NOW() - INTERVAL '6 months'
        GROUP BY TO_CHAR(created_at, 'YYYY-MM')
        ORDER BY month DESC
      `
    ]);

    // Calculate growth percentages (simplified)
    const lastWeekUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    });

    const previousWeekUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    });

    const userGrowth = previousWeekUsers > 0 
      ? ((lastWeekUsers - previousWeekUsers) / previousWeekUsers * 100).toFixed(1)
      : '0';

    const stats = {
      overview: {
        totalUsers,
        totalProjects,
        totalMentors,
        totalMentorshipSessions,
        userGrowth: `${userGrowth}%`,
        projectGrowth: '+8.2%', // Placeholder
        mentorGrowth: '+15.7%', // Placeholder
        sessionGrowth: '+12.3%' // Placeholder
      },
      recentActivity: [
        ...recentUsers.map(user => ({
          type: 'user_registered',
          description: `${user.name} joined the platform`,
          timestamp: user.createdAt,
          user: {
            name: user.name,
            avatar: user.avatarUrl
          }
        })),
        ...recentProjects.map(project => ({
          type: 'project_created',
          description: `${project.user.name} published "${project.title}"`,
          timestamp: project.createdAt,
          user: {
            name: project.user.name,
            avatar: project.user.avatarUrl
          }
        }))
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10),
      monthlyStats
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    
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
