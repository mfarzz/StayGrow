import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value;
    if (!token) return NextResponse.json({ authenticated: false }, { status: 400 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    if (typeof decoded === 'object' && decoded && 'userId' in decoded) {
      // Fetch user data from database to get latest role and other info
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId as string },
        select: {
          id: true,
          email: true,
          role: true,
        },
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      return NextResponse.json({ 
        userId: user.id,
        email: user.email,
        role: user.role
      });
    } else {
      return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
 