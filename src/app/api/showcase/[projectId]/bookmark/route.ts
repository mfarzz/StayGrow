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

    if (action === "bookmark") {
      // Check if already bookmarked
      const existingBookmark = await prisma.savedItem.findFirst({
        where: {
          userId,
          itemType: "PROJECT",
          itemId: projectId
        }
      });

      if (!existingBookmark) {
        // Create bookmark
        await prisma.savedItem.create({
          data: {
            userId,
            itemType: "PROJECT",
            itemId: projectId
          }
        });
      }
    } else if (action === "unbookmark") {
      // Remove bookmark
      await prisma.savedItem.deleteMany({
        where: {
          userId,
          itemType: "PROJECT",
          itemId: projectId
        }
      });
    }

    // Get updated counts
    const totalBookmarks = await prisma.savedItem.count({
      where: { 
        itemType: "PROJECT",
        itemId: projectId 
      }
    });

    // Check if user currently has bookmarked the project
    const userBookmark = await prisma.savedItem.findFirst({
      where: {
        userId,
        itemType: "PROJECT",
        itemId: projectId
      }
    });

    return NextResponse.json({
      success: true,
      isBookmarked: !!userBookmark,
      totalBookmarks: totalBookmarks
    });

  } catch (error) {
    console.error("Error in bookmark endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
