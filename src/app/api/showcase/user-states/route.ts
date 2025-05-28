import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
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

    const { projectIds } = await request.json();

    if (!Array.isArray(projectIds) || projectIds.length === 0) {
      return NextResponse.json({ error: "Invalid project IDs" }, { status: 400 });
    }

    // Get user's likes for these projects
    const likes = await prisma.projectLike.findMany({
      where: {
        userId,
        projectId: { in: projectIds }
      },
      select: { projectId: true }
    });

    // Get user's bookmarks for these projects
    const bookmarks = await prisma.savedItem.findMany({
      where: {
        userId,
        itemType: "PROJECT",
        itemId: { in: projectIds }
      },
      select: { itemId: true }
    });

    // Transform to object format
    const likeStates: Record<string, boolean> = {};
    const bookmarkStates: Record<string, boolean> = {};

    projectIds.forEach(projectId => {
      likeStates[projectId] = likes.some(like => like.projectId === projectId);
      bookmarkStates[projectId] = bookmarks.some(bookmark => bookmark.itemId === projectId);
    });

    return NextResponse.json({
      success: true,
      likes: likeStates,
      bookmarks: bookmarkStates
    });

  } catch (error) {
    console.error("Error fetching user states:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
