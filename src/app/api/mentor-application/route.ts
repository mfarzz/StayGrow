import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

// GET - Get mentor application for current user or all applications (admin only)
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get('admin') === 'true';

    if (isAdmin) {
      // Admin endpoint - get all applications
      if (decoded.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
      }

      const applications = await prisma.mentorApplication.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
              createdAt: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return NextResponse.json({ applications });
    } else {
      // User endpoint - get own application
      const application = await prisma.mentorApplication.findUnique({
        where: { userId: decoded.userId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true
            }
          }
        }
      });

      return NextResponse.json({ application });
    }
  } catch (error) {
    console.error('Error fetching mentor application:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

// POST - Submit mentor application
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

    // Check if user is PEMUDA
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || user.role !== 'PEMUDA') {
      return NextResponse.json({ 
        error: 'Hanya pemuda yang dapat mengajukan menjadi mentor' 
      }, { status: 403 });
    }

    // Check if application already exists
    const existingApplication = await prisma.mentorApplication.findUnique({
      where: { userId: decoded.userId }
    });

    if (existingApplication) {
      return NextResponse.json({ 
        error: 'Anda sudah memiliki pengajuan mentor' 
      }, { status: 400 });
    }

    const body = await request.json();
    const {
      motivation,
      experience,
      expertise,
      availableHours,
      linkedinUrl,
      portfolioUrl,
      education,
      currentPosition
    } = body;

    // Validation
    if (!motivation || !experience || !expertise || expertise.length === 0 || !availableHours) {
      return NextResponse.json({ 
        error: 'Semua field wajib harus diisi' 
      }, { status: 400 });
    }

    if (availableHours < 1 || availableHours > 40) {
      return NextResponse.json({ 
        error: 'Jam ketersediaan harus antara 1-40 jam per minggu' 
      }, { status: 400 });
    }

    const application = await prisma.mentorApplication.create({
      data: {
        userId: decoded.userId,
        motivation,
        experience,
        expertise,
        availableHours: parseInt(availableHours),
        linkedinUrl: linkedinUrl || null,
        portfolioUrl: portfolioUrl || null,
        education: education || null,
        currentPosition: currentPosition || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true
          }
        }
      }
    });

    return NextResponse.json({ 
      message: 'Pengajuan mentor berhasil dikirim',
      application 
    });
  } catch (error) {
    console.error('Error creating mentor application:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

// PUT - Update application status (admin only)
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

    if (decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();
    const { applicationId, status, adminNotes } = body;

    if (!applicationId || !status || !['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ 
        error: 'Data tidak valid' 
      }, { status: 400 });
    }

    const application = await prisma.mentorApplication.findUnique({
      where: { id: applicationId },
      include: { user: true }
    });

    if (!application) {
      return NextResponse.json({ 
        error: 'Pengajuan tidak ditemukan' 
      }, { status: 404 });
    }

    // Update application status
    const updatedApplication = await prisma.mentorApplication.update({
      where: { id: applicationId },
      data: {
        status,
        adminNotes: adminNotes || null,
        reviewedBy: decoded.userId,
        reviewedAt: new Date()
      }
    });

    // If approved, update user role to MENTOR
    if (status === 'APPROVED') {
      await prisma.user.update({
        where: { id: application.userId },
        data: { role: 'MENTOR' }
      });
    }

    return NextResponse.json({ 
      message: `Pengajuan berhasil ${status === 'APPROVED' ? 'disetujui' : 'ditolak'}`,
      application: updatedApplication 
    });
  } catch (error) {
    console.error('Error updating mentor application:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
