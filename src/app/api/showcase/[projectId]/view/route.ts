import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import jwt from "jsonwebtoken";

export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const projectId = params.projectId;

    // Get user ID if authenticated (optional for views)
    let userId: string | null = null;
    try {
      const token = request.cookies.get("auth-token")?.value;
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        if (typeof decoded === 'object' && decoded && 'userId' in decoded) {
          userId = decoded.userId as string;
        }
      }
    } catch {
      // Continue without auth - allow anonymous views
    }

    // Check if project exists
    const project = await prisma.showcaseProject.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Track view if user is authenticated
    if (userId) {
      // Prevent project owners from inflating their own view counts
      if (project.userId === userId) {
        return NextResponse.json({
          success: true,
          message: "View not tracked - project owner",
          isOwner: true
        });
      }

      // Check if user has already viewed this project recently (within last hour)
      const recentView = await prisma.projectView.findFirst({
        where: {
          projectId,
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
            projectId,
            userId,
          },
        });

        // Update project view count
        await prisma.showcaseProject.update({
          where: { id: projectId },
          data: {
            viewCount: {
              increment: 1,
            },
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "View tracked successfully"
    });

  } catch (error) {
    console.error("Error tracking view:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
