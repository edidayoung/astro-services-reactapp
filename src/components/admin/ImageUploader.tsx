import { useState, useRef, DragEvent } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Upload, X, Image as ImageIcon, Loader2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { uploadImageToCloudinary, validateImageFile } from '@/lib/admin/cloudinary';
import type { UploadProgress } from '@/lib/admin/cloudinary';

interface ImageData {
  url: string;
  isPrimary: boolean;
  order: number;
}

interface ImageUploaderProps {
  images: ImageData[];
  onChange: (images: ImageData[]) => void;
  maxImages?: number;
}

interface UploadingImage {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
}

export function ImageUploader({ images, onChange, maxImages = 5 }: ImageUploaderProps) {
  const [uploadingImages, setUploadingImages] = useState<UploadingImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files);
    const remainingSlots = maxImages - images.length - uploadingImages.length;

    if (filesArray.length > remainingSlots) {
      toast.error(`You can only upload ${remainingSlots} more image(s)`);
      return;
    }

    // Validate and upload files
    for (const file of filesArray) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        toast.error(`${file.name}: ${validation.error}`);
        continue;
      }

      // Create preview
      const preview = URL.createObjectURL(file);
      const uploadId = `upload-${Date.now()}-${Math.random()}`;

      const uploadingImage: UploadingImage = {
        id: uploadId,
        file,
        preview,
        progress: 0,
        status: 'uploading',
      };

      setUploadingImages((prev) => [...prev, uploadingImage]);

      // Upload to Cloudinary
      try {
        const result = await uploadImageToCloudinary(file, (progress: UploadProgress) => {
          setUploadingImages((prev) =>
            prev.map((img) =>
              img.id === uploadId
                ? { ...img, progress: progress.percentage, status: progress.status }
                : img
            )
          );
        });

        // Add to images array
        const newImage: ImageData = {
          url: result.url,
          isPrimary: images.length === 0, // First image is primary
          order: images.length,
        };

        onChange([...images, newImage]);

        // Remove from uploading
        setUploadingImages((prev) => prev.filter((img) => img.id !== uploadId));
        
        // Clean up preview URL
        URL.revokeObjectURL(preview);
        
        toast.success('Image uploaded successfully');
      } catch (error: any) {
        console.error('Upload error:', error);
        toast.error(`Failed to upload ${file.name}`);
        
        setUploadingImages((prev) =>
          prev.map((img) =>
            img.id === uploadId ? { ...img, status: 'error' } : img
          )
        );
      }
    }
  };

  // Handle drag & drop
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    
    // If removed image was primary and there are other images, make the first one primary
    if (images[index].isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true;
    }
    
    // Update order
    newImages.forEach((img, i) => {
      img.order = i;
    });
    
    onChange(newImages);
    toast.info('Image removed');
  };

  // Set primary image
  const handleSetPrimary = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    onChange(newImages);
    toast.success('Primary image updated');
  };

  // Reorder images
  const handleReorder = (newOrder: ImageData[]) => {
    const reorderedImages = newOrder.map((img, index) => ({
      ...img,
      order: index,
    }));
    onChange(reorderedImages);
  };

  // Remove uploading image
  const handleRemoveUploading = (id: string) => {
    setUploadingImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) {
        URL.revokeObjectURL(img.preview);
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const canUploadMore = images.length + uploadingImages.length < maxImages;

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
          ${isDragging ? 'border-purple-500 bg-purple-500/10' : 'border-border hover:border-border/80'}
          ${!canUploadMore && 'opacity-50 cursor-not-allowed'}
        `}
        onClick={() => canUploadMore && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={!canUploadMore}
        />
        
        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-sm font-medium mb-1">
          {canUploadMore ? 'Drop images here or click to upload' : 'Maximum images reached'}
        </p>
        <p className="text-xs text-muted-foreground">
          {canUploadMore
            ? `JPEG, PNG, WebP up to 2MB (${images.length + uploadingImages.length}/${maxImages})`
            : `You've reached the limit of ${maxImages} images`}
        </p>
      </div>

      {/* Uploading Images */}
      {uploadingImages.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {uploadingImages.map((uploadingImage) => (
            <Card key={uploadingImage.id} className="relative p-2 border-border/50">
              <div className="aspect-square rounded-lg overflow-hidden bg-surface/30 mb-2">
                <img
                  src={uploadingImage.preview}
                  alt="Uploading"
                  className="w-full h-full object-cover"
                />
                {uploadingImage.status === 'uploading' && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-white mx-auto mb-2" />
                      <p className="text-xs text-white">{uploadingImage.progress}%</p>
                    </div>
                  </div>
                )}
              </div>
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-1 right-1 h-6 w-6"
                onClick={() => handleRemoveUploading(uploadingImage.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Card>
          ))}
        </div>
      )}

      {/* Uploaded Images - Reorderable */}
      {images.length > 0 && (
        <Reorder.Group
          axis="x"
          values={images}
          onReorder={handleReorder}
          className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
        >
          {images.map((image, index) => (
            <Reorder.Item key={image.url} value={image} className="cursor-move">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Card className="relative p-2 border-border/50 hover:border-purple-500 transition-colors group">
                  {/* Primary Badge */}
                  {image.isPrimary && (
                    <div className="absolute top-1 left-1 z-10">
                      <div className="bg-yellow-500 text-black px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current" />
                        Primary
                      </div>
                    </div>
                  )}

                  {/* Image */}
                  <div 
                    className="aspect-square rounded-lg overflow-hidden bg-surface/30 mb-2 cursor-pointer"
                    onClick={() => !image.isPrimary && handleSetPrimary(index)}
                    title={image.isPrimary ? 'Primary image' : 'Click to set as primary'}
                  >
                    <img
                      src={image.url}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  {/* Remove Button */}
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>

                  {/* Order Number */}
                  <p className="text-xs text-center text-muted-foreground">
                    {index + 1}
                  </p>
                </Card>
              </motion.div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}

      {/* Empty State */}
      {images.length === 0 && uploadingImages.length === 0 && (
        <Card className="p-8 border-border/50 text-center">
          <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-sm text-muted-foreground">No images uploaded yet</p>
        </Card>
      )}
    </div>
  );
}
