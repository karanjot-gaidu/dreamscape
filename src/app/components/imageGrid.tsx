import React, { useState } from 'react';

interface ImageRecord {
  id: string;
  prompt: string;
  imageUrl: string;
  generationTime: number;
  createdAt: Date;
}

interface ImageGridProps {
  images: ImageRecord[];
  onRemoveImage?: (id: string) => void;
  onToggleLike?: (id: string) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, onRemoveImage, onToggleLike }) => {
  const [likedImages, setLikedImages] = useState<Set<string>>(new Set());

  const handleLikeToggle = (id: string) => {
    setLikedImages((prev) => {
      const newLikedImages = new Set(prev);
      if (newLikedImages.has(id)) {
        newLikedImages.delete(id); // Unlike if already liked
      } else {
        newLikedImages.add(id); // Like if not liked
      }
      onToggleLike?.(id); // Optional parent callback
      return newLikedImages;
    });
  };

  const handleRemove = (id: string) => {
    onRemoveImage?.(id); // Call parent callback
  };

  const handleShare = async (imageUrl: string, prompt: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'shared-image.png', { type: blob.type });

      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: 'Check out this image!',
          text: prompt,
        });
      } else {
        // Fallback for browsers that don't support navigator.share
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'shared-image.png';
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Sharing failed:', error);
    }
  };

  const getGridClasses = (total: number, index: number): string => {
    if (total === 1) return "col-span-2 row-span-2";
    if (total === 2) return "col-span-1 row-span-2";
    if (total === 3) return index === 0 ? "col-span-2 row-span-2" : "col-span-1 row-span-1";
    if (total === 4) return "col-span-1 row-span-1";
    if (total === 5) return index === 0 ? "col-span-2 row-span-2" : "col-span-1 row-span-1";
    return "col-span-1 row-span-1";
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto h-[30rem] p-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="grid grid-cols-2 gap-1 auto-rows-[200px]">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`relative overflow-hidden bg-gray-100 ${getGridClasses(images.length, index)}`}
          >
            {/* Remove Button */}
            <button
              onClick={() => handleRemove(image.id)}
              className="absolute top-2 right-2 border-black-500 text-white rounded-md w-6 h-6 flex items-center justify-center z-10 hover:bg-red-500"
            >
              ✕
            </button>

            {/* Like Button */}
            <button
              onClick={() => handleLikeToggle(image.id)}
              className={`absolute top-2 left-2 text-white rounded-md w-6 h-6 flex items-center justify-center z-10 hover:bg-red-500`}
            >
              {likedImages.has(image.id) ? '❤️' : '♡'}
            </button>

            {/* Share Button */}
            <button
              onClick={() => handleShare(image.imageUrl, image.prompt)}
              className="absolute bottom-2 right-2 text-blue-500 rounded-md px-2 py-1 text-xs z-10 hover:bg-blue-600"
            >
              🔗
            </button>

            {/* Image */}
            <img
              src={image.imageUrl}
              alt={image.prompt}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGrid;
