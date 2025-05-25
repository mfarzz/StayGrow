import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            return NextResponse.json({ message: "Email tidak valid" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (user?.provider !== "manual") {
            return NextResponse.json({ message: "Akun tidak ditemukan" }, { status: 400 });
        }

        if (!user) {
            return NextResponse.json({ message: "Jika akun terdaftar, email akan dikirim" }); // Jangan bocorkan info akun
        }

        const token = randomUUID();
        const expiresAt = new Date(Date.now() + 1000 * 60 * 10); // 10 menit

        // Simpan token ke tabel password_reset_tokens
        await prisma.passwordResetToken.create({
            data: {
                userId: user.id,
                token,
                expiresAt,
            },
        });

        const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

        console.log("Reset link:", resetLink); // Untuk debugging, bisa dihapus nanti

        // Template email yang menarik dan sesuai tema
        const emailTemplate = `
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Password - StayGrow.id</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                    background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 50%, #f0fdfa 100%);
                    padding: 20px;
                    line-height: 1.6;
                }
                
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 24px;
                    overflow: hidden;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                }
                
                .header {
                    background: linear-gradient(135deg, #059669 0%, #10b981 100%);
                    padding: 40px 30px;
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                }
                
                .header::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    right: -50%;
                    width: 100%;
                    height: 200%;
                    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
                    transform: rotate(45deg);
                }
                
                .logo {
                    font-size: 36px;
                    font-weight: 900;
                    color: white;
                    margin-bottom: 8px;
                    letter-spacing: -1px;
                }
                
                .tagline {
                    color: rgba(255, 255, 255, 0.9);
                    font-size: 16px;
                    font-weight: 500;
                }
                
                .content {
                    padding: 40px 30px;
                }
                
                .greeting {
                    font-size: 24px;
                    font-weight: 700;
                    color: #1f2937;
                    margin-bottom: 16px;
                }
                
                .message {
                    font-size: 16px;
                    color: #4b5563;
                    margin-bottom: 32px;
                    line-height: 1.7;
                }
                
                .cta-container {
                    text-align: center;
                    margin: 40px 0;
                }
                
                .cta-button {
                    display: inline-block;
                    background: linear-gradient(135deg, #059669 0%, #10b981 100%);
                    color: white;
                    text-decoration: none;
                    padding: 16px 32px;
                    border-radius: 50px;
                    font-weight: 600;
                    font-size: 16px;
                    transition: all 0.3s ease;
                    box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.2);
                }
                
                .cta-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 20px 25px -5px rgba(16, 185, 129, 0.3);
                }
                
                .alternative-link {
                    background: #f9fafb;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    padding: 20px;
                    margin: 24px 0;
                }
                
                .alternative-link p {
                    font-size: 14px;
                    color: #6b7280;
                    margin-bottom: 8px;
                }
                
                .link-text {
                    font-size: 14px;
                    color: #059669;
                    word-break: break-all;
                    font-family: monospace;
                    background: white;
                    padding: 8px 12px;
                    border-radius: 6px;
                    border: 1px solid #d1fae5;
                }
                
                .security-note {
                    background: #fef3c7;
                    border-left: 4px solid #f59e0b;
                    padding: 16px;
                    border-radius: 8px;
                    margin: 24px 0;
                }
                
                .security-note p {
                    font-size: 14px;
                    color: #92400e;
                    margin: 0;
                }
                
                .expiry {
                    background: #fee2e2;
                    border: 1px solid #fecaca;
                    border-radius: 8px;
                    padding: 12px;
                    text-align: center;
                    margin: 24px 0;
                }
                
                .expiry p {
                    font-size: 14px;
                    color: #dc2626;
                    font-weight: 600;
                    margin: 0;
                }
                
                .footer {
                    background: #f9fafb;
                    padding: 30px;
                    text-align: center;
                    border-top: 1px solid #e5e7eb;
                }
                
                .footer-logo {
                    font-size: 20px;
                    font-weight: 800;
                    background: linear-gradient(135deg, #059669 0%, #10b981 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 8px;
                }
                
                .footer-text {
                    font-size: 14px;
                    color: #6b7280;
                    margin-bottom: 16px;
                }
                
                .social-links {
                    display: flex;
                    justify-content: center;
                    gap: 16px;
                    margin-top: 16px;
                }
                
                .social-links a {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #059669 0%, #10b981 100%);
                    color: white;
                    text-decoration: none;
                    border-radius: 50%;
                    transition: transform 0.3s ease;
                }
                
                .social-links a:hover {
                    transform: scale(1.1);
                }
                
                @media (max-width: 600px) {
                    .container {
                        margin: 10px;
                        border-radius: 16px;
                    }
                    
                    .content, .header, .footer {
                        padding: 24px 20px;
                    }
                    
                    .greeting {
                        font-size: 20px;
                    }
                    
                    .logo {
                        font-size: 28px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">StayGrow.id</div>
                    <div class="tagline">Inovasi AI untuk Kemajuan Berkelanjutan</div>
                </div>
                
                <div class="content">
                    <h1 class="greeting">Halo, ${user.name || 'Sobat StayGrow'}! 👋</h1>
                    
                    <p class="message">
                        Kami menerima permintaan untuk mengatur ulang password akun StayGrow.id Anda. 
                        Jangan khawatir, ini adalah proses yang aman dan mudah untuk membantu Anda 
                        kembali mengakses platform AI terdepan untuk pengembangan karier berkelanjutan.
                    </p>
                    
                    <div class="cta-container">
                        <a href="${resetLink}" class="cta-button">
                            🔐 Reset Password Sekarang
                        </a>
                    </div>
                    
                    <div class="alternative-link">
                        <p><strong>Tidak bisa mengklik tombol di atas?</strong></p>
                        <p>Salin dan tempel link berikut ke browser Anda:</p>
                        <div class="link-text">${resetLink}</div>
                    </div>
                    
                    <div class="expiry">
                        <p>⏰ Link ini akan kedaluwarsa dalam 10 menit</p>
                    </div>
                    
                    <div class="security-note">
                        <p>
                            <strong>🛡️ Catatan Keamanan:</strong> Jika Anda tidak meminta reset password, 
                            abaikan email ini. Akun Anda tetap aman dan tidak ada perubahan yang dilakukan.
                        </p>
                    </div>
                </div>
                
                <div class="footer">
                    <div class="footer-logo">StayGrow.id</div>
                    <p class="footer-text">
                        Membantu Generasi Muda Berkembang Berkelanjutan
                    </p>
                    <p class="footer-text">
                        📧 info@staygrow.id | 🌐 www.staygrow.id
                    </p>
                    
                    <div class="social-links">
                        <a href="#" title="Twitter">🐦</a>
                        <a href="#" title="LinkedIn">💼</a>
                        <a href="#" title="Instagram">📸</a>
                    </div>
                    
                    <p style="font-size: 12px; color: #9ca3af; margin-top: 16px;">
                        © 2025 StayGrow.id. Semua hak dilindungi.
                    </p>
                </div>
            </div>
        </body>
        </html>
        `;

        // Kirim email
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_FROM,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: `"StayGrow.id - Platform AI Karier" <${process.env.EMAIL_FROM}>`,
            to: email,
            subject: "🔐 Reset Password Akun StayGrow.id Anda",
            html: emailTemplate,
        });

        return NextResponse.json({ message: "Jika email valid, link reset dikirim" });
    } catch (error) {
        console.error("Error sending reset email:", error);
        return NextResponse.json({ message: "Terjadi kesalahan pada server" }, { status: 500 });
    }
}