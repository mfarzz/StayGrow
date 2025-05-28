// app/api/showcase/route.ts (POST method)
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const search = searchParams.get('search') || '';
    const filter = searchParams.get('filter') || 'all';
    const sdg = searchParams.get('sdg') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '9');
    const sortBy = searchParams.get('sortBy') || 'newest';
    const userId = searchParams.get('userId') || ''; // Add userId parameter
    
    // Get current user ID for liked/bookmarked filters
    let currentUserId: string | null = null;
    try {
      const token = request.cookies.get("auth-token")?.value;
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        if (typeof decoded === 'object' && decoded && 'userId' in decoded) {
          currentUserId = decoded.userId as string;
        }
      }
    } catch {
      // Continue without auth
    }
    
    // Calculate offset for pagination
    const offset = (page - 1) * limit;
    
    // Build where conditions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereConditions: any = {
      status: 'PUBLISHED', // Only show published projects
    };

    // Filter by specific user if userId is provided
    if (userId) {
      whereConditions.userId = userId;
    }
    
    // Search filter
    if (search) {
      whereConditions.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { techTags: { has: search } },
      ];
    }
    
    // Featured filter
    if (filter === 'featured') {
      whereConditions.featured = true;
    }
    
    // AI Match filter (projects with high match score)
    if (filter === 'ai-match') {
      whereConditions.aiMatchScore = { gte: 85 };
    }
    
    // Liked projects filter
    if (filter === 'liked' && currentUserId) {
      whereConditions.likes = { some: { userId: currentUserId } };
    }
    
    // Bookmarked projects filter
    if (filter === 'bookmarked' && currentUserId) {
      whereConditions.savedItems = { some: { userId: currentUserId, itemType: 'PROJECT' } };
    }
    
    // SDG filter
    if (sdg !== 'all') {
      whereConditions.sdgTags = { has: sdg };
    }
    
    // Sort options
    let orderBy: { [key: string]: 'asc' | 'desc' | { _count: 'asc' | 'desc' } } = { createdAt: 'desc' }; // default: newest
    
    switch (sortBy) {
      case 'popular':
        orderBy = { viewCount: 'desc' };
        break;
      case 'likes':
        orderBy = { likes: { _count: 'desc' } };
        break;
      case 'match':
        orderBy = { aiMatchScore: 'desc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }
    
    // Get projects with relations
    const projects = await prisma.showcaseProject.findMany({
      where: whereConditions,
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
        likes: currentUserId ? {
          where: { userId: currentUserId },
          select: { id: true },
        } : { select: { id: true } },
        savedItems: currentUserId ? {
          where: { userId: currentUserId, itemType: 'PROJECT' },
          select: { id: true },
        } : { select: { id: true } },
        _count: {
          select: {
            likes: true,
            views: true,
            savedItems: true,
          },
        },
      },
      orderBy,
      skip: offset,
      take: limit,
    });
    
    // Get total count for pagination
    const totalCount = await prisma.showcaseProject.count({
      where: whereConditions,
    });
    
    // Transform data to match frontend expectations
    const transformedProjects = projects.map((project) => ({
      id: project.id,
      title: project.title,
      author: project.user.name,
      authorRole: project.user.role,
      authorId: project.user.id,
      location: project.user.location || 'Indonesia',
      image: project.imageUrl || '/api/placeholder/400/240',
      avatarUrl: project.user.avatarUrl,
      likes: project._count.likes,
      views: project._count.views || project.viewCount,
      saves: project._count.savedItems,
      sdgTags: project.sdgTags,
      techTags: project.techTags,
      description: project.description,
      createdAt: project.createdAt.toISOString().split('T')[0],
      featured: project.featured,
      aiMatchScore: project.aiMatchScore || 0,
      githubUrl: project.githubUrl,
      demoUrl: project.demoUrl,
      status: project.status,
      isLiked: currentUserId ? project.likes.length > 0 : false,
      isBookmarked: currentUserId ? project.savedItems.length > 0 : false,
    }));
    
    const response = {
      projects: transformedProjects,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNextPage: offset + limit < totalCount,
        hasPreviousPage: page > 1,
      },
      filters: {
        search,
        filter,
        sdg,
        sortBy,
      },
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Error fetching showcase projects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
    try {
        // Check authentication token first
        const token = request.cookies.get('auth-token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

        if (!(typeof decoded === 'object' && decoded && 'userId' in decoded)) {
            return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
        }

        const authenticatedUserId = decoded.userId as string;

        const body = await request.json();

        const {
            title,
            description,
            imageUrl,
            sdgTags,
            techTags,
            githubUrl,
            demoUrl,
            status = 'PUBLISHED'
        } = body;

        // Validation
        if (!title || !description) {
            return NextResponse.json(
                { error: 'Missing required fields: title, description' },
                { status: 400 }
            );
        }

        // Verify user exists
        const user = await prisma.user.findUnique({
            where: { id: authenticatedUserId }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Create new project
        const newProject = await prisma.showcaseProject.create({
            data: {
                userId: authenticatedUserId,
                title,
                description,
                imageUrl: imageUrl || null,
                sdgTags: sdgTags || [],
                techTags: techTags || [],
                githubUrl: githubUrl || null,
                demoUrl: demoUrl || null,
                status,
                featured: false, // New projects start as non-featured
                aiMatchScore: null, // Will be calculated later by AI service
                viewCount: 0,
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
            },
        });

        // Transform response to match frontend expectations
        const transformedProject = {
            id: newProject.id,
            title: newProject.title,
            author: newProject.user.name,
            authorRole: newProject.user.role,
            authorId: newProject.user.id,
            location: newProject.user.location || 'Indonesia',
            image: newProject.imageUrl || '/api/placeholder/400/240',
            avatarUrl: newProject.user.avatarUrl,
            likes: 0,
            views: 0,
            saves: 0,
            sdgTags: newProject.sdgTags,
            techTags: newProject.techTags,
            description: newProject.description,
            createdAt: newProject.createdAt.toISOString().split('T')[0],
            featured: newProject.featured,
            aiMatchScore: newProject.aiMatchScore || 0,
            githubUrl: newProject.githubUrl,
            demoUrl: newProject.demoUrl,
            status: newProject.status,
        };

        return NextResponse.json({
            message: 'Project created successfully',
            project: transformedProject
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating project:', error);
        
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