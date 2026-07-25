import { useState, useRef, DragEvent } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { uploadImageToCloudinary, validateImageFile } from '@/lib/admin/cloudinary';
import type { UploadProgress } from '@/lib/admin/cloudinary';
import type { RepairImage } from '@/lib/admin/repairs';

interface RepairImageUploaderProps {
  images: RepairImage[];
  onChange: (images: RepairImage[]) => void;
  label: string;
  minImages?: number;
  maxImages?: number;
}

interface UploadingImage {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
}

export function RepairImageUploader({ 
  images, 
  onChange, 
  label,
  minImages = 1,
  maxImages = 5 
}: RepairImageUploaderProps) {
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
        const newImage: RepairImage = {
          url: result.url,
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
    
    // Update order
    newImages.forEach((img, i) => {
      img.order = i;
    });
    
    onChange(newImages);
    toast.info('Image removed');
  };

  // Reorder images
  const handleReorder = (newOrder: RepairImage[]) => {
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
  const hasMinimum = images.length >= minImages;

  return (
    <div className="space-y-4">
      {/* Label with count */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold">
          {label}
          <span className="text-muted-foreground ml-2">
            ({images.length}/{maxImages})
          </span>
        </label>
        {!hasMinimum && (
          <span className="text-xs text-red-500">
            Minimum {minImages} image{minImages > 1 ? 's' : ''} required
          </span>
        )}
      </div>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
          ${isDragging ? 'border-green-500 bg-green-500/10' : 'border-border hover:border-border/80'}
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
        
        <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
        <p className="text-sm font-medium mb-1">
          {canUploadMore ? 'Drop images here or click to upload' : 'Maximum images reached'}
        </p>
        <p className="text-xs text-muted-foreground">
          JPEG, PNG, WebP up to 2MB • Min {minImages}, Max {maxImages}
        </p>
      </div>

      {/* Uploading Images */}
      {uploadingImages.length > 0 && (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          {uploadingImages.map((uploadingImage) => (
            <Card key={uploadingImage.id} className="relative p-2 border-border/50">
              <div className="aspect-square rounded-lg overflow-hidden bg-surface/30 mb-2 relative">
                <img
                  src={uploadingImage.preview}
                  alt="Uploading"
                  className="w-full h-full object-cover"
                />
                {uploadingImage.status === 'uploading' && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="h-6 w-6 animate-spin text-white mx-auto mb-1" />
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
          className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-5"
        >
          {images.map((image, index) => (
            <Reorder.Item key={image.url} value={image} className="cursor-move">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Card className="relative p-2 border-border/50 hover:border-green-500 transition-colors group">
                  {/* Image */}
                  <div className="aspect-square rounded-lg overflow-hidden bg-surface/30 mb-2">
                    <img
                      src={image.url}
                      alt={`${label} ${index + 1}`}
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
                    #{index + 1}
                  </p>
                </Card>
              </motion.div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}

      {/* Empty State */}
      {images.length === 0 && uploadingImages.length === 0 && (
        <Card className="p-6 border-border/50 text-center">
          <ImageIcon className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-50" />
          <p className="text-sm text-muted-foreground">No {label.toLowerCase()} uploaded yet</p>
        </Card>
      )}
    </div>
  );
}
