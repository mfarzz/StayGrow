import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: "Token dan password wajib diisi." }, { status: 400 });
    }

    // Cari user berdasarkan token
    const cekToken = await prisma.passwordResetToken.findFirst({
        where: { 
            token,
            expiresAt: {
                gte: new Date(), // Pastikan token belum kadaluarsa
            },
        },
    });

    if (!cekToken) {
      return NextResponse.json({ error: "Token tidak valid atau telah kadaluarsa." }, { status: 400 });
    }

    // Hash password baru
    const hashedPassword = await hash(newPassword, 10);

    // Update password & hapus token reset
    await prisma.user.update({
      where: { id: cekToken.userId },
      data: {
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: "Password berhasil direset." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Terjadi kesalahan di server." }, { status: 500 });
  }
}
