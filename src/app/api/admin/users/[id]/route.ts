import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

interface RouteParams {
  params: {
    id: string;
  };
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
    const adminUser = await prisma.user.findUnique({
      where: { id: decoded.userId as string },
      select: { role: true }
    });

    if (!adminUser || adminUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied. Admin role required.' }, { status: 403 });
    }

    const { action } = await request.json();
    const userId = params.id;

    // Validate user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent admin from modifying other admins
    if (user.role === 'ADMIN' && user.id !== decoded.userId) {
      return NextResponse.json({ error: 'Cannot modify other admin users' }, { status: 403 });
    }

    interface ApiResponse {
      success: boolean;
      message?: string;
      user?: unknown;
    }

    const response: ApiResponse = { success: true };

    switch (action) {
      case 'activate':
        // Since User model doesn't have isActive field, we could use a different approach
        // For now, we'll just return success without updating anything
        response.message = 'User activation not implemented (User model has no isActive field)';
        break;

      case 'deactivate':
        // Since User model doesn't have isActive field, we could use a different approach
        // For now, we'll just return success without updating anything
        response.message = 'User deactivation not implemented (User model has no isActive field)';
        break;

      case 'delete':
        // For delete, we need to be careful about cascading deletes
        // Delete user's related data first or set proper cascade rules
        await prisma.user.delete({
          where: { id: userId }
        });
        return NextResponse.json({ success: true, message: 'User deleted successfully' });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // For activate/deactivate, we don't actually update anything since the field doesn't exist
    // Just return the current user data
    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
        _count: {
          select: {
            showcaseProjects: true
          }
        },
        mentorApplication: {
          select: {
            id: true,
            status: true
          }
        }
      }
    });

    response.user = updatedUser;

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error updating user:', error);
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
    const adminUser = await prisma.user.findUnique({
      where: { id: decoded.userId as string },
      select: { role: true }
    });

    if (!adminUser || adminUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied. Admin role required.' }, { status: 403 });
    }

    const userId = params.id;

    // Validate user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent admin from deleting other admins
    if (user.role === 'ADMIN' && user.id !== decoded.userId) {
      return NextResponse.json({ error: 'Cannot delete other admin users' }, { status: 403 });
    }

    // Delete the user
    await prisma.user.delete({
      where: { id: userId }
    });

    return NextResponse.json({ success: true, message: 'User deleted successfully' });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
