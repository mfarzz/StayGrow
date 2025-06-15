import nodemailer from "nodemailer";

export interface EmailNotificationData {
  to: string;
  subject: string;
  html: string;
}

export class EmailService {
  private static transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  static async sendNotification(data: EmailNotificationData): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: `"StayGrow.id - Platform AI Karier" <${process.env.EMAIL_FROM}>`,
        to: data.to,
        subject: data.subject,
        html: data.html,
      });
      return true;
    } catch (error) {
      console.error("Error sending email notification:", error);
      return false;
    }
  }

  static createProjectFlaggedEmailTemplate(
    projectTitle: string, 
    projectId: string, 
    reason?: string,
    projectOwnerName?: string
  ): string {
    const flagReason = reason || 'Content review required';
    const ownerName = projectOwnerName || 'User';
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Proyek Anda Ditandai untuk Peninjauan</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 32px 24px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">
                    🚨 StayGrow.id - Proyek Ditandai
                </h1>
                <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px;">
                    Proyek Anda memerlukan peninjauan lebih lanjut
                </p>
            </div>
            
            <!-- Content -->
            <div style="padding: 32px 24px;">
                <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                    <h2 style="color: #92400e; margin: 0 0 8px 0; font-size: 18px; font-weight: 600;">
                        ⚠️ Proyek Memerlukan Peninjauan
                    </h2>
                    <p style="color: #92400e; margin: 0; font-size: 14px;">
                        Halo ${ownerName}, proyek Anda telah ditandai oleh tim moderasi kami dan sedang dalam proses peninjauan.
                    </p>
                </div>
                
                <h3 style="color: #374151; margin: 0 0 16px 0; font-size: 20px; font-weight: 600;">
                    Proyek yang Ditandai:
                </h3>
                
                <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                    <h4 style="color: #111827; margin: 0 0 8px 0; font-size: 18px; font-weight: 600;">
                        📋 ${projectTitle}
                    </h4>
                    <p style="color: #6b7280; margin: 0 0 8px 0; font-size: 14px;">
                        ID Proyek: ${projectId}
                    </p>
                    <p style="color: #dc2626; margin: 0; font-size: 14px; font-weight: 500;">
                        Alasan: ${flagReason}
                    </p>
                </div>
                
                <div style="margin: 24px 0;">
                    <h4 style="color: #374151; margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">
                        Apa yang terjadi selanjutnya?
                    </h4>
                    <ul style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                        <li>Tim moderasi kami akan meninjau proyek Anda</li>
                        <li>Proyek sementara tidak akan muncul di halaman showcase publik</li>
                        <li>Anda akan mendapat notifikasi ketika peninjauan selesai</li>
                        <li>Proyek dapat disetujui atau memerlukan revisi</li>
                    </ul>
                </div>
                
                <div style="background-color: #eff6ff; border: 1px solid #3b82f6; border-radius: 8px; padding: 16px; margin: 24px 0;">
                    <p style="color: #1e40af; margin: 0; font-size: 14px; font-weight: 500;">
                        💡 Tip: Pastikan proyek Anda mengikuti pedoman komunitas StayGrow.id untuk mempercepat proses persetujuan.
                    </p>
                </div>
                
                <div style="text-align: center; margin: 32px 0;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://staygrow.id'}/home/profile" 
                       style="display: inline-block; background-color: #059669; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                        Lihat Proyek Saya
                    </a>
                </div>
                
                <div style="border-top: 1px solid #e5e7eb; padding-top: 24px; margin-top: 32px;">
                    <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0;">
                        Jika Anda memiliki pertanyaan tentang proses peninjauan, silakan hubungi tim support kami.
                    </p>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
                <div style="margin-bottom: 16px;">
                    <a href="#" style="text-decoration: none; margin: 0 8px; font-size: 20px;" title="LinkedIn">🔗</a>
                    <a href="#" style="text-decoration: none; margin: 0 8px; font-size: 20px;" title="Twitter">🐦</a>
                    <a href="#" style="text-decoration: none; margin: 0 8px; font-size: 20px;" title="Instagram">📸</a>
                </div>
                
                <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                    © 2025 StayGrow.id. Semua hak dilindungi.
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
  }
}
