import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from 'google-auth-library';

// Inisialisasi Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Interface untuk request body
interface RegisterRequest {
  fullName?: string;
  email: string;
  password?: string;
  googleToken?: string;
  provider?: 'manual' | 'google';
}

export async function POST(req: NextRequest) {
  try {
    const {
      fullName,
      email,
      password,
      googleToken,
      provider = 'manual'
    }: RegisterRequest = await req.json();

    // Validasi email wajib
    if (!email) {
      return NextResponse.json(
        { error: "Email wajib diisi" },
        { status: 400 }
      );
    }

    // Cek apakah user sudah terdaftar
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      // Jika sudah register manual dan sekarang daftar pakai Google
      if (
        provider === 'google' &&
        googleToken &&
        existingUser.provider === 'manual'
      ) {
        // Upgrade akun manual ke Google
        const ticket = await client.verifyIdToken({
          idToken: googleToken,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        if (!payload || payload.email !== email) {
          return NextResponse.json(
            { error: "Token Google tidak valid atau email tidak cocok" },
            { status: 400 }
          );
        }

        const updatedUser = await prisma.user.update({
          where: { email },
          data: {
            provider: 'google',
            googleId: payload.sub,
            emailVerified: true,
            name: payload.name || existingUser.name,
          },
          select: {
            id: true,
            name: true,
            email: true,
            provider: true,
            emailVerified: true,
            createdAt: true,
          }
        });

        const token = jwt.sign(
          {
            userId: updatedUser.id,
            email: updatedUser.email,
            provider: updatedUser.provider
          },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '7d' }
        );

        const response = NextResponse.json({
          message: "Akun berhasil diupgrade ke Google",
          user: updatedUser
        });

        response.cookies.set('auth-token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60,
          path: '/',
        });

        return response;
      }

      // Kalau akun sudah ada dengan provider sama, tolak
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    let userData: {
      name: string;
      email: string;
      password?: string | undefined;
      provider: string;
      googleId?: string | undefined;
      emailVerified?: boolean | undefined;
    };

    // Handle registrasi berdasarkan provider
    if (provider === 'google' && googleToken) {
      // Verifikasi Google token
      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      if (!payload) {
        return NextResponse.json(
          { error: "Token Google tidak valid" },
          { status: 400 }
        );
      }

      // Validasi email dari Google sama dengan yang dikirim
      if (payload.email !== email) {
        return NextResponse.json(
          { error: "Email Google tidak sesuai" },
          { status: 400 }
        );
      }

      userData = {
        name: payload.name || fullName || payload.email?.split('@')[0] || 'User',
        email: payload.email!,
        provider: 'google',
        googleId: payload.sub,
        emailVerified: true, // Google sudah memverifikasi email
      };

    } else if (provider === 'manual') {
      // Validasi untuk registrasi manual
      if (!fullName || !password) {
        return NextResponse.json(
          { error: "Nama lengkap dan password wajib diisi" },
          { status: 400 }
        );
      }

      // Validasi password strength
      if (password.length < 8) {
        return NextResponse.json(
          { error: "Password minimal 8 karakter" },
          { status: 400 }
        );
      }

      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        return NextResponse.json(
          { error: "Password harus mengandung huruf besar, huruf kecil, dan angka" },
          { status: 400 }
        );
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      userData = {
        name: fullName,
        email,
        password: hashedPassword,
        provider: 'manual',
        emailVerified: false, // Perlu verifikasi email manual
      };

    } else {
      return NextResponse.json(
        { error: "Provider registrasi tidak valid" },
        { status: 400 }
      );
    }

    // Buat user baru
    const user = await prisma.user.create({
      data: userData,
      select: {
        id: true,
        name: true,
        email: true,
        provider: true,
        emailVerified: true,
        createdAt: true,
      }
    });

    // Generate response berdasarkan provider
    if (provider === 'google') {
      // Untuk Google OAuth, langsung set token ke cookies
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          provider: user.provider
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      const response = NextResponse.json({
        message: "Registrasi dengan Google berhasil",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          provider: user.provider,
          emailVerified: user.emailVerified,
        }
      });

      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
      });

      return response;

    } else {
      // Untuk registrasi manual, TIDAK set token ke cookies
      // User harus login manual untuk mendapatkan token
      return NextResponse.json({
        message: "Registrasi berhasil. Silakan login untuk melanjutkan.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          provider: user.provider,
          emailVerified: user.emailVerified,
        },
        requireLogin: true // Flag untuk frontend
      });
    }

  } catch (error) {
    console.error('Registration error:', error);

    // Handle specific Google OAuth errors
    if (error instanceof Error && error.message.includes('Token used too early')) {
      return NextResponse.json(
        { error: "Token Google tidak valid atau expired" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Terjadi kesalahan server. Silakan coba lagi." },
      { status: 500 }
    );
  }
}