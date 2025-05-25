import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value;
    if (!token) return NextResponse.json({ authenticated: false }, { status: 400 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    if (typeof decoded === 'object' && decoded && 'userId' in decoded) {
      return NextResponse.json({ userId: decoded.userId });
    } else {
      return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
 