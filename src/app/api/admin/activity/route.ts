import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

interface JWTPayload {
  userId: string;
  role: string;
}

interface Activity {
  id: string;
  type: 'user_registered' | 'project_submitted' | 'mentor_applied' | 'content_flagged';
  message: string;
  timestamp: string;
  user: string;
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

    // Fetch recent activities
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        createdAt: true
      }
    });

    const recentProjects = await prisma.showcaseProject.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    });

    const recentApplications = await prisma.mentorApplication.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    });

    // Combine and format activities
    const activities: Activity[] = [];

    // Add user registrations
    recentUsers.forEach(user => {
      activities.push({
        id: `user_${user.id}`,
        type: 'user_registered',
        message: `New user registered: ${user.name}`,
        timestamp: user.createdAt.toISOString(),
        user: user.name || 'Unknown'
      });
    });

    // Add project submissions
    recentProjects.forEach(project => {
      activities.push({
        id: `project_${project.id}`,
        type: 'project_submitted',
        message: `New showcase project: "${project.title}"`,
        timestamp: project.createdAt.toISOString(),
        user: project.user.name || 'Unknown'
      });
    });

    // Add mentor applications
    recentApplications.forEach(application => {
      activities.push({
        id: `application_${application.id}`,
        type: 'mentor_applied',
        message: `New mentor application from ${application.user.name}`,
        timestamp: application.createdAt.toISOString(),
        user: application.user.name || 'Unknown'
      });
    });

    // Sort all activities by timestamp (newest first)
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Return top 10 activities
    return NextResponse.json(activities.slice(0, 10));
  } catch (error) {
    console.error('Failed to fetch admin activity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent activity' },
      { status: 500 }
    );
  }
}
