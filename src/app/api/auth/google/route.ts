// file: app/api/auth/google/route.ts

import { NextRequest, NextResponse } from "next/server";

const client_id = process.env.GOOGLE_CLIENT_ID!;
const redirect_uri = process.env.GOOGLE_REDIRECT_URI!;
const scope = encodeURIComponent("openid email profile");
const response_type = "code";
const access_type = "offline";
const prompt = "consent";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const state = searchParams.get("state") || "login"; // default ke login jika tidak ada

  const url = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${client_id}` +
    `&redirect_uri=${redirect_uri}` +
    `&response_type=${response_type}` +
    `&scope=${scope}` +
    `&state=${state}` +
    `&access_type=${access_type}` +
    `&prompt=${prompt}`;

  return NextResponse.redirect(url);
}
