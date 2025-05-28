interface UploadOptions {
  type: 'avatar' | 'showcase' | 'banner' | 'thumbnail';
  oldUrl?: string;
}

interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

// Constants for file validation
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// Utility function to validate file
function validateFile(file: File): FileValidationResult {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: "Format file tidak didukung. Gunakan JPG, PNG, atau WebP."
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `Ukuran file terlalu besar. Maksimal ${MAX_FILE_SIZE / (1024 * 1024)}MB.`
    };
  }

  return { isValid: true };
}

async function uploadFile(file: File, options: UploadOptions): Promise<string> {
  // Validate file before uploading
  const validation = validateFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', options.type);
    
    if (options.oldUrl) {
      formData.append('oldUrl', options.oldUrl);
    }

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Upload gagal');
    }
    
    const data = await res.json();
    
    if (!data.url) {
      throw new Error('URL tidak ditemukan dalam response');
    }
    
    return data.url; // URL gambar yang bisa disimpan ke database
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

// Legacy function for backward compatibility
async function uploadAvatar(file: File): Promise<string> {
  return uploadFile(file, { type: 'avatar' });
}

export default uploadAvatar;
export { uploadFile, validateFile, type UploadOptions, type FileValidationResult, MAX_FILE_SIZE, ALLOWED_FILE_TYPES };