// app/api/auth/callback/google/route.ts
import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from 'google-auth-library';
import prisma from '@/lib/prisma';
import jwt from "jsonwebtoken";

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXTAUTH_URL}/api/auth/callback/google`
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state'); // 'register' atau 'login'
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/register?error=google_oauth_error`
      );
    }

    if (!code) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/register?error=missing_code`
      );
    }

    // Exchange code for tokens
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    // Get user info from Google
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/register?error=invalid_google_response`
      );
    }

    const email = payload.email;

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email }
    });

    if (user) {
      // User exists
      if( user.provider === 'google'){
        if (state === 'register') {
          return NextResponse.redirect(
            `${process.env.NEXTAUTH_URL}/login?error=account_exists`
          );
        }
      }
      if (user.provider === 'manual') {
        if (state === 'register') {
          // Upgrade manual account to Google
          user = await prisma.user.update({
            where: { email },
            data: {
              provider: 'google',
              googleId: payload.sub!,
              emailVerified: true,
              avatarUrl: payload.picture,
            }
          });
        } else {
          // Trying to login with Google but account manual
          return NextResponse.redirect(
            `${process.env.NEXTAUTH_URL}/login?error=account_exists_different_provider`
          );
        }
      }
      // else: provider already 'google', lanjut ke login
    } else {
      // No account exists, create one
      if (state === 'register') {
        user = await prisma.user.create({
          data: {
            name: payload.name || payload.email.split('@')[0],
            email: payload.email,
            provider: 'google',
            googleId: payload.sub!,
            emailVerified: true,
            avatarUrl: payload.picture,
          }
        });
      } else {
        // Trying to login but user belum terdaftar
        return NextResponse.redirect(
          `${process.env.NEXTAUTH_URL}/login?error=account_not_found`
        );
      }
    }

    // Generate JWT token
    const authToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        provider: user.provider
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Create response and set cookie
    const redirectUrl = state === 'register'
      ? `${process.env.NEXTAUTH_URL}/home?welcome=true`
      : `${process.env.NEXTAUTH_URL}/home`;

    const response = NextResponse.redirect(redirectUrl);

    response.cookies.set('auth-token', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/register?error=oauth_callback_failed`
    );
  }
}
