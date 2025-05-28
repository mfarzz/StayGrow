import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Helper function to delete old file
async function deleteOldFile(oldUrl: string) {
  if (!oldUrl || !oldUrl.startsWith('/uploads/')) return;
  
  try {
    const oldFilePath = path.join(process.cwd(), 'public', oldUrl);
    await fs.unlink(oldFilePath);
    console.log('Old file deleted:', oldFilePath);
  } catch (error) {
    console.log('Failed to delete old file (might not exist):', error);
  }
}

// Helper function to create directory
async function ensureDirectoryExists(dirPath: string) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    console.error('Failed to create directory:', error);
  }
}

export async function POST(req: NextRequest) {
  try {
    // Parse form-data dari request
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'avatar', 'showcase', 'banner', etc.
    const oldUrl = formData.get('oldUrl') as string; // URL gambar lama yang akan dihapus

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!type) {
      return NextResponse.json({ error: 'Upload type is required' }, { status: 400 });
    }

    // Validasi tipe file
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Validasi ukuran file (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    // Buat folder berdasarkan jenis upload
    const baseUploadDir = path.join(process.cwd(), 'public', 'uploads');
    const typeUploadDir = path.join(baseUploadDir, type);
    await ensureDirectoryExists(typeUploadDir);

    // Generate unique filename dengan prefix berdasarkan type
    const timestamp = Date.now();
    const fileExtension = path.extname(file.name);
    const fileName = `${type}_${timestamp}${fileExtension}`;
    const filePath = path.join(typeUploadDir, fileName);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.writeFile(filePath, buffer);

    // Hapus file lama jika ada
    if (oldUrl) {
      await deleteOldFile(oldUrl);
    }

    // Return URL path
    const fileUrl = `/uploads/${type}/${fileName}`;
    
    return NextResponse.json({ 
      url: fileUrl,
      message: 'File uploaded successfully',
      type: type,
      size: file.size,
      originalName: file.name
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' }, 
      { status: 500 }
    );
  }
}
