// Cloudinary Image Upload Helper
const CLOUDINARY_CONFIG = {
  cloudName: 'dahl5h8iy',
  uploadPreset: 'astro-services',
  maxImages: 5,
  maxSize: 2 * 1024 * 1024, // 2MB
  acceptedTypes: ['image/jpeg', 'image/png', 'image/webp']
};

export interface UploadResult {
  url: string;
  publicId: string;
}

export interface UploadProgress {
  percentage: number;
  status: 'uploading' | 'success' | 'error';
}

// Upload single image to Cloudinary
export async function uploadImageToCloudinary(
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  // Validate file type
  if (!CLOUDINARY_CONFIG.acceptedTypes.includes(file.type)) {
    throw new Error(`Invalid file type. Accepted: ${CLOUDINARY_CONFIG.acceptedTypes.join(', ')}`);
  }

  // Validate file size
  if (file.size > CLOUDINARY_CONFIG.maxSize) {
    const sizeMB = (CLOUDINARY_CONFIG.maxSize / (1024 * 1024)).toFixed(0);
    throw new Error(`File too large. Maximum size: ${sizeMB}MB`);
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
  formData.append('folder', 'astro-services/products');

  try {
    onProgress?.({ percentage: 0, status: 'uploading' });

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    
    onProgress?.({ percentage: 100, status: 'success' });

    return {
      url: data.secure_url,
      publicId: data.public_id
    };
  } catch (error) {
    onProgress?.({ percentage: 0, status: 'error' });
    console.error('❌ Cloudinary upload error:', error);
    throw error;
  }
}

// Upload multiple images
export async function uploadMultipleImages(
  files: File[],
  onProgress?: (index: number, progress: UploadProgress) => void
): Promise<UploadResult[]> {
  if (files.length > CLOUDINARY_CONFIG.maxImages) {
    throw new Error(`Maximum ${CLOUDINARY_CONFIG.maxImages} images allowed`);
  }

  const uploadPromises = files.map((file, index) =>
    uploadImageToCloudinary(file, (progress) => {
      onProgress?.(index, progress);
    })
  );

  return Promise.all(uploadPromises);
}

// Get Cloudinary config
export function getCloudinaryConfig() {
  return CLOUDINARY_CONFIG;
}

// Validate image file
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!CLOUDINARY_CONFIG.acceptedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Accepted: JPEG, PNG, WebP`
    };
  }

  if (file.size > CLOUDINARY_CONFIG.maxSize) {
    const sizeMB = (CLOUDINARY_CONFIG.maxSize / (1024 * 1024)).toFixed(0);
    return {
      valid: false,
      error: `File too large. Maximum: ${sizeMB}MB`
    };
  }

  return { valid: true };
}
