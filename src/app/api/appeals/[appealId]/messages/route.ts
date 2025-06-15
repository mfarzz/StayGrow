import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';

interface Props {
  params: { appealId: string };
}

// GET /api/appeals/[appealId]/messages - Get messages for an appeal
export async function GET(req: NextRequest, { params }: Props) {
  try {
    const headersList = await headers();
    const isAuthenticated = headersList.get('x-user-authenticated') === 'true';
    const userId = headersList.get('x-user-id');
    const userRole = headersList.get('x-user-role');

    if (!isAuthenticated || !userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Cek apakah appeal exists dan user punya akses
    const appeal = await prisma.projectAppeal.findUnique({
      where: { id: params.appealId },
      select: { userId: true, id: true }
    });

    if (!appeal) {
      return NextResponse.json(
        { error: 'Appeal not found' },
        { status: 404 }
      );
    }

    // Cek permission
    if (userRole !== 'ADMIN' && appeal.userId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const messages = await prisma.appealMessage.findMany({
      where: { appealId: params.appealId },
      include: {
        sender: {
          select: { id: true, name: true, avatarUrl: true, role: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/appeals/[appealId]/messages - Send a new message
export async function POST(req: NextRequest, { params }: Props) {
  try {
    const headersList = await headers();
    const isAuthenticated = headersList.get('x-user-authenticated') === 'true';
    const userId = headersList.get('x-user-id');
    const userRole = headersList.get('x-user-role');

    if (!isAuthenticated || !userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { message } = await req.json();

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Cek apakah appeal exists dan user punya akses
    const appeal = await prisma.projectAppeal.findUnique({
      where: { id: params.appealId },
      select: { userId: true, id: true, status: true }
    });

    if (!appeal) {
      return NextResponse.json(
        { error: 'Appeal not found' },
        { status: 404 }
      );
    }

    // Cek permission
    if (userRole !== 'ADMIN' && appeal.userId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Cek apakah appeal masih aktif
    if (appeal.status === 'CLOSED' || appeal.status === 'RESOLVED') {
      return NextResponse.json(
        { error: 'Cannot send messages to a closed or resolved appeal' },
        { status: 400 }
      );
    }

    // Buat message baru
    const newMessage = await prisma.appealMessage.create({
      data: {
        appealId: params.appealId,
        senderId: userId,
        message: message.trim(),
        isAdminMessage: userRole === 'ADMIN'
      },
      include: {
        sender: {
          select: { id: true, name: true, avatarUrl: true, role: true }
        }
      }
    });

    // Update appeal status menjadi IN_PROGRESS jika masih OPEN
    if (appeal.status === 'OPEN') {
      await prisma.projectAppeal.update({
        where: { id: params.appealId },
        data: { 
          status: 'IN_PROGRESS',
          assignedTo: userRole === 'ADMIN' ? userId : undefined
        }
      });
    }

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
