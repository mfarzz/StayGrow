// app/api/showcase/[projectId]/route.ts (GET, DELETE specific project)
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(
    request: NextRequest,
    { params }: { params: { projectId: string } }
) {
    try {
        // Get user ID from JWT if available (for personalized data)
        let userId: string | null = null;
        try {
            const token = request.cookies.get('auth-token')?.value;
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
                if (typeof decoded === 'object' && decoded && 'userId' in decoded) {
                    userId = decoded.userId as string;
                }
            }
        } catch {
            // Continue without auth - some data can be public
        }

        const project = await prisma.showcaseProject.findUnique({
            where: { id: params.projectId },
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
                likes: userId ? {
                    where: { userId },
                    select: { userId: true },
                } : false,
                savedItems: userId ? {
                    where: {
                        itemType: "PROJECT",
                        userId,
                    },
                    select: { userId: true },
                } : false,
                _count: {
                    select: {
                        likes: true,
                        views: true,
                        savedItems: true,
                    },
                },
            },
        });

        if (!project) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        // Increment view count if this is a new view
        if (userId) {
            // Check if user has already viewed this project recently (within last hour)
            const recentView = await prisma.projectView.findFirst({
                where: {
                    projectId: params.projectId,
                    userId,
                    viewedAt: {
                        gte: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
                    },
                },
            });

            if (!recentView) {
                // Create new view record
                await prisma.projectView.create({
                    data: {
                        projectId: params.projectId,
                        userId,
                    },
                });

                // Update project view count
                await prisma.showcaseProject.update({
                    where: { id: params.projectId },
                    data: {
                        viewCount: {
                            increment: 1,
                        },
                    },
                });
            }
        }

        // Transform data
        const transformedProject = {
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
            createdAt: project.createdAt.toISOString(),
            featured: project.featured,
            aiMatchScore: project.aiMatchScore || 0,
            githubUrl: project.githubUrl,
            demoUrl: project.demoUrl,
            status: project.status,
            // User-specific data
            isLiked: userId && Array.isArray(project.likes) ? project.likes.length > 0 : false,
            isBookmarked: userId && Array.isArray(project.savedItems) ? project.savedItems.length > 0 : false,
        };

        return NextResponse.json(transformedProject);

    } catch (error) {
        console.error('Error fetching project:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { projectId: string } }
) {
    try {
        // Get user ID from JWT token
        const token = request.cookies.get('auth-token')?.value;
        if (!token) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        let userId: string;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            if (typeof decoded === 'object' && decoded && 'userId' in decoded) {
                userId = decoded.userId as string;
            } else {
                throw new Error('Invalid token structure');
            }
        } catch {
            return NextResponse.json(
                { error: 'Invalid authentication token' },
                { status: 401 }
            );
        }

        // Parse request body
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

        // Validate required fields
        if (!title || !description) {
            return NextResponse.json(
                { error: 'Title and description are required' },
                { status: 400 }
            );
        }

        // Verify project exists and user is the owner
        const existingProject = await prisma.showcaseProject.findUnique({
            where: { id: params.projectId }
        });

        if (!existingProject) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        if (existingProject.userId !== userId) {
            return NextResponse.json(
                { error: 'Unauthorized - you can only update your own projects' },
                { status: 403 }
            );
        }

        // Update the project
        const updatedProject = await prisma.showcaseProject.update({
            where: { id: params.projectId },
            data: {
                title: title.trim(),
                description: description.trim(),
                imageUrl: imageUrl || existingProject.imageUrl,
                sdgTags: Array.isArray(sdgTags) ? sdgTags : [],
                techTags: Array.isArray(techTags) ? techTags : [],
                githubUrl: githubUrl?.trim() || null,
                demoUrl: demoUrl?.trim() || null,
                status: status,
                updatedAt: new Date(),
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
                        savedItems: {
                            where: { itemType: 'PROJECT' }
                        },
                    },
                },
            },
        });

        // Transform the response to match the expected format
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
            createdAt: updatedProject.createdAt.toISOString(),
            featured: updatedProject.featured,
            aiMatchScore: updatedProject.aiMatchScore || 0,
            githubUrl: updatedProject.githubUrl,
            demoUrl: updatedProject.demoUrl,
            status: updatedProject.status,
        };

        return NextResponse.json({
            message: 'Project updated successfully',
            project: transformedProject
        });

    } catch (error) {
        console.error('Error updating project:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { projectId: string } }
) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Verify project exists and user is the owner
        const existingProject = await prisma.showcaseProject.findUnique({
            where: { id: params.projectId }
        });

        if (!existingProject) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        if (existingProject.userId !== userId) {
            return NextResponse.json(
                { error: 'Unauthorized - you can only delete your own projects' },
                { status: 403 }
            );
        }

        // Delete related records first (cascade delete)
        await prisma.projectLike.deleteMany({
            where: { projectId: params.projectId }
        });

        await prisma.projectView.deleteMany({
            where: { projectId: params.projectId }
        });

        await prisma.savedItem.deleteMany({
            where: {
                itemType: 'PROJECT',
                itemId: params.projectId
            }
        });

        // Delete the project
        await prisma.showcaseProject.delete({
            where: { id: params.projectId }
        });

        return NextResponse.json({
            message: 'Project deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting project:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}