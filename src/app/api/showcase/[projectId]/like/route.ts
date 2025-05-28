import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import jwt from "jsonwebtoken";

export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    // Get user from token
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    if (!(typeof decoded === 'object' && decoded && 'userId' in decoded)) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const userId = decoded.userId as string;

    const { action } = await request.json();
    const projectId = params.projectId;

    // Check if project exists
    const project = await prisma.showcaseProject.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (action === "like") {
      // Check if already liked
      const existingLike = await prisma.projectLike.findUnique({
        where: {
          userId_projectId: {
            userId,
            projectId: projectId
          }
        }
      });

      if (!existingLike) {
        // Create like
        await prisma.projectLike.create({
          data: {
            userId,
            projectId: projectId
          }
        });
      }
    } else if (action === "unlike") {
      // Remove like
      await prisma.projectLike.deleteMany({
        where: {
          userId,
          projectId: projectId
        }
      });
    }

    // Get updated counts
    const totalLikes = await prisma.projectLike.count({
      where: { projectId }
    });

    // Check if user currently likes the project
    const userLike = await prisma.projectLike.findUnique({
      where: {
        userId_projectId: {
          userId,
          projectId: projectId
        }
      }
    });

    return NextResponse.json({
      success: true,
      isLiked: !!userLike,
      totalLikes: totalLikes
    });

  } catch (error) {
    console.error("Error in like endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
