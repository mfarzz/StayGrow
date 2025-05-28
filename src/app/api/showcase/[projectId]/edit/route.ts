import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    // Check authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    if (!(typeof decoded === 'object' && decoded && 'userId' in decoded)) {
      return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
    }

    const authenticatedUserId = decoded.userId as string;
    const projectId = params.projectId;

    // Get request body
    const body = await request.json();
    const {
      title,
      description,
      imageUrl,
      sdgTags,
      techTags,
      githubUrl,
      demoUrl,
      status
    } = body;

    // Check if project exists and user is the owner
    const existingProject = await prisma.showcaseProject.findUnique({
      where: { id: projectId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true,
            location: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    if (existingProject.userId !== authenticatedUserId) {
      return NextResponse.json(
        { error: 'Unauthorized - you can only edit your own projects' },
        { status: 403 }
      );
    }

    // Prevent editing of published projects
    if (existingProject.status === 'PUBLISHED') {
      return NextResponse.json(
        { 
          error: 'Tidak dapat mengedit proyek yang sudah dipublikasi',
          message: 'Proyek yang sudah dipublikasi tidak dapat diedit. Hanya proyek dengan status draft yang dapat diubah.'
        },
        { status: 400 }
      );
    }

    // Validation for publishing
    if (status === 'PUBLISHED') {
      const validationErrors = [];

      if (!title || title.trim().length < 5) {
        validationErrors.push('Judul proyek harus minimal 5 karakter');
      }

      if (!description || description.trim().length < 50) {
        validationErrors.push('Deskripsi proyek harus minimal 50 karakter');
      }

      if (!imageUrl || imageUrl.trim().length === 0) {
        validationErrors.push('Gambar proyek wajib diisi');
      }

      if (!sdgTags || sdgTags.length === 0) {
        validationErrors.push('Minimal satu SDG tag harus dipilih');
      }

      if (!techTags || techTags.length === 0) {
        validationErrors.push('Minimal satu tech tag harus dipilih');
      }

      if (validationErrors.length > 0) {
        return NextResponse.json(
          { 
            error: 'Validasi gagal', 
            validationErrors,
            message: 'Proyek belum lengkap untuk dipublikasi. Silakan lengkapi data yang diperlukan.'
          },
          { status: 400 }
        );
      }
    }

    // Basic validation for required fields
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Judul dan deskripsi wajib diisi' },
        { status: 400 }
      );
    }

    // Update the project
    const updatedProject = await prisma.showcaseProject.update({
      where: { id: projectId },
      data: {
        title: title.trim(),
        description: description.trim(),
        imageUrl: imageUrl || null,
        sdgTags: sdgTags || [],
        techTags: techTags || [],
        githubUrl: githubUrl || null,
        demoUrl: demoUrl || null,
        status: status || 'DRAFT',
        // Update AI match score if publishing
        aiMatchScore: status === 'PUBLISHED' ? Math.floor(Math.random() * 30) + 70 : null, // Random score between 70-100
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true,
            location: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            likes: true,
            views: true,
            savedItems: true,
          },
        },
      },
    });

    // Transform response to match frontend expectations
    const transformedProject = {
      id: updatedProject.id,
      title: updatedProject.title,
      author: updatedProject.user.name,
      authorRole: updatedProject.user.role,
      authorId: updatedProject.user.id,
      location: updatedProject.user.location || 'Indonesia',
      image: updatedProject.imageUrl || '/api/placeholder/400/240',
      avatarUrl: updatedProject.user.avatarUrl,
      likes: updatedProject._count.likes,
      views: updatedProject._count.views || updatedProject.viewCount,
      saves: updatedProject._count.savedItems,
      sdgTags: updatedProject.sdgTags,
      techTags: updatedProject.techTags,
      description: updatedProject.description,
      createdAt: updatedProject.createdAt.toISOString().split('T')[0],
      featured: updatedProject.featured,
      aiMatchScore: updatedProject.aiMatchScore || 0,
      githubUrl: updatedProject.githubUrl,
      demoUrl: updatedProject.demoUrl,
      status: updatedProject.status,
    };

    return NextResponse.json({
      message: status === 'PUBLISHED' ? 'Proyek berhasil dipublikasi' : 'Proyek berhasil diupdate',
      project: transformedProject
    });

  } catch (error) {
    console.error('Error updating project:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
