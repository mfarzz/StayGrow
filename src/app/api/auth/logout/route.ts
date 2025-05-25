import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json({ message: 'Logged out successfully' });

    // Clear the auth token
    response.cookies.delete('auth-token');

    return response;
}