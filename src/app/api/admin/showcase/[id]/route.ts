import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { EmailService } from '@/lib/emailService';

interface RouteParams {
  params: {
    id: string;
  };
}

interface ProjectWithDetails {
  id: string;
  userId: string;
  title: string;
  description: string;
  imageUrl: string | null;
  sdgTags: string[];
  techTags: string[];
  featured: boolean;
  aiMatchScore: number | null;
  githubUrl: string | null;
  demoUrl: string | null;
  status: string;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
  _count: {
    likes: number;
    views: number;
    savedItems: number;
  };
}

interface ApiResponse {
  success: boolean;
  project?: ProjectWithDetails;
  message?: string;
  notificationSent?: boolean;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
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

    const { action, reason } = await request.json();
    const projectId = params.id;

    // Validate project exists
    const project = await prisma.showcaseProject.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    let updateData: { status: string } = { status: '' };
    const response: ApiResponse = { success: true };

    switch (action) {
      case 'approve':
        updateData = {
          status: 'PUBLISHED'
        };
        break;

      case 'flag':
        updateData = {
          status: 'FLAGGED'
        };
        break;

      case 'archive':
        updateData = {
          status: 'ARCHIVED'
        };
        break;

      case 'delete':
        // For delete, we'll actually delete the record
        await prisma.showcaseProject.delete({
          where: { id: projectId }
        });
        return NextResponse.json({ success: true, message: 'Project deleted successfully' });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Update the project 
    const updatedProject = await prisma.showcaseProject.update({
      where: { id: projectId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true
          }
        },
        _count: {
          select: {
            likes: true,
            views: true,
            savedItems: true
          }
        }
      }
    });

    // Send notification to project owner when project is flagged
    if (action === 'flag') {
      try {
        // Send email notification to project owner
        await EmailService.sendNotification({
          to: updatedProject.user.email,
          subject: 'Your Project on StayGrow Has Been Flagged',
          html: EmailService.createProjectFlaggedEmailTemplate(
            updatedProject.title,
            updatedProject.id,
            reason,
            updatedProject.user.name || 'User'
          )
        });
        
        console.log(`Project ${projectId} flagged by admin. Notification sent to: ${updatedProject.user.email}. Reason: ${reason || 'No specific reason provided'}`);
        
        response.notificationSent = true;
      } catch (notificationError) {
        console.error('Failed to send notification:', notificationError);
        response.notificationSent = false;
      }
    }

    response.project = updatedProject;

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    const projectId = params.id;

    // Validate project exists
    const project = await prisma.showcaseProject.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Delete the project
    await prisma.showcaseProject.delete({
      where: { id: projectId }
    });

    return NextResponse.json({ success: true, message: 'Project deleted successfully' });

  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
