// app/api/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get('auth-token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

        if (typeof decoded === 'object' && decoded && 'userId' in decoded) {
            const user = await prisma.user.findUnique({
                where: { id: decoded.userId as string },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    provider: true,
                    googleId: true,
                    emailVerified: true,
                    role: true,
                    bio: true,
                    location: true,
                    avatarUrl: true,
                    phone: true,
                    createdAt: true,
                },
            });

            if (!user) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }

            return NextResponse.json({ user });
        } else {
            return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
        }
    } catch {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        // Verifikasi token
        const token = req.cookies.get('auth-token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

        if (!(typeof decoded === 'object' && decoded && 'userId' in decoded)) {
            return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
        }

        const userId = decoded.userId as string;

        // Parse request body
        const body = await req.json();
        const { name, bio, location, phone, avatarUrl, email: _email } = body;
        // Jika ada field email di body, tolak
        if (_email) {
            return NextResponse.json({ error: 'Email tidak dapat diubah.' }, { status: 400 });
        }
        // Validasi input
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        // Validasi phone number (opsional)
        if (phone && typeof phone === 'string' && !isValidPhone(phone)) {
            return NextResponse.json({ error: 'Invalid phone number format' }, { status: 400 });
        }

        // Cek apakah user exists
        const existingUser = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!existingUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Update user profile
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name: name.trim(),
                bio: bio ? bio.trim() : null,
                location: location ? location.trim() : null,
                phone: phone ? phone.trim() : null,
                avatarUrl: avatarUrl ? avatarUrl.trim() : null,
            },
            select: {
                id: true,
                name: true,
                email: true,
                provider: true,
                googleId: true,
                emailVerified: true,
                role: true,
                bio: true,
                location: true,
                avatarUrl: true,
                phone: true,
                createdAt: true,
            }
        });

        return NextResponse.json({ 
            message: 'Profile updated successfully',
            user: updatedUser 
        });

    } catch (error) {
        console.error('Profile update error:', error);
        
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        return NextResponse.json({ 
            error: 'Internal server error' 
        }, { status: 500 });
    }
}

function isValidPhone(phone: string): boolean {
    // Regex untuk format nomor Indonesia dan internasional
    const phoneRegex = /^(\+62|62|0)[0-9]{8,13}$/;
    const cleanPhone = phone.replace(/[\s-()]/g, ''); // Remove spaces, dashes, parentheses
    return phoneRegex.test(cleanPhone);
}