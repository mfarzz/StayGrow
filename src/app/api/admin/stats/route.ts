import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

interface JWTPayload {
  userId: string;
  role: string;
}

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication - support both Bearer token and cookie
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    
    if (decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get current date for filtering
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Fetch all statistics in parallel
    const [
      totalUsers,
      totalProjects,
      pendingApplications,
      newUsersThisMonth,
      projectsThisMonth,
      applicationsThisMonth
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      
      // Total projects
      prisma.showcaseProject.count(),
      
      // Pending mentor applications
      prisma.mentorApplication.count({
        where: {
          status: 'PENDING'
        }
      }),
      
      // New users this month
      prisma.user.count({
        where: {
          createdAt: {
            gte: firstDayOfMonth
          }
        }
      }),
      
      // Projects this month
      prisma.showcaseProject.count({
        where: {
          createdAt: {
            gte: firstDayOfMonth
          }
        }
      }),
      
      // Applications this month
      prisma.mentorApplication.count({
        where: {
          createdAt: {
            gte: firstDayOfMonth
          }
        }
      })
    ]);

    const stats = {
      totalUsers,
      totalProjects,
      pendingApplications,
      flaggedContent: 0, // Placeholder until moderation system is fully implemented
      activeUsers: Math.floor(totalUsers * 0.6), // Estimate 60% active users
      newUsersThisMonth,
      projectsThisMonth,
      applicationsThisMonth
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Failed to fetch admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
