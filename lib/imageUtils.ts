/**
 * Utility functions for managing product images
 */

export interface ProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
  sortOrder: number;
}

/**
 * Process and validate product images
 * @param mainImage - Main product image URL
 * @param additionalImages - Array of additional image URLs
 * @param fallbackImage - Fallback image if no images are available
 * @returns Array of processed images
 */
export function processProductImages(
  mainImage?: string | null,
  additionalImages?: string[] | null,
  fallbackImage: string = "/default.png"
): string[] {
  const images: string[] = [];
  
  // Add main image if it exists and is valid
  if (mainImage && isValidImageUrl(mainImage)) {
    images.push(mainImage);
  }
  
  // Add additional images if they exist and are valid
  if (additionalImages && Array.isArray(additionalImages)) {
    additionalImages.forEach(img => {
      if (img && isValidImageUrl(img) && !images.includes(img)) {
        images.push(img);
      }
    });
  }
  
  // If no valid images, add fallback
  if (images.length === 0) {
    images.push(fallbackImage);
  }
  
  return images;
}

/**
 * Validate if a URL is a valid image URL
 * @param url - URL to validate
 * @returns boolean indicating if URL is valid
 */
export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  // Check if it's a valid URL
  try {
    new URL(url);
  } catch {
    return false;
  }
  
  // Check if it's a relative path (starts with /)
  if (url.startsWith('/')) return true;
  
  // Check if it's an external image URL
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const hasImageExtension = imageExtensions.some(ext => 
    url.toLowerCase().includes(ext)
  );
  
  // Check if it's a data URL
  if (url.startsWith('data:image/')) return true;
  
  return hasImageExtension;
}

/**
 * Get optimized image URL for different screen sizes
 * @param originalUrl - Original image URL
 * @param width - Desired width
 * @param height - Desired height
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(
  originalUrl: string,
  width: number,
  height: number
): string {
  // If it's a relative path or data URL, return as is
  if (originalUrl.startsWith('/') || originalUrl.startsWith('data:')) {
    return originalUrl;
  }
  
  // For external URLs, you might want to use an image optimization service
  // This is a placeholder - implement based on your image optimization strategy
  return originalUrl;
}

/**
 * Generate alt text for product images
 * @param productName - Product name
 * @param imageIndex - Index of the image
 * @param totalImages - Total number of images
 * @param language - Language code ('en' or 'ar')
 * @returns Generated alt text
 */
export function generateImageAltText(
  productName: string,
  imageIndex: number,
  totalImages: number,
  language: 'en' | 'ar' = 'en'
): string {
  if (language === 'ar') {
    return `${productName} - صورة ${imageIndex + 1} من ${totalImages}`;
  }
  
  return `${productName} - Image ${imageIndex + 1} of ${totalImages}`;
}

/**
 * Check if image is loaded successfully
 * @param url - Image URL to check
 * @returns Promise that resolves to boolean
 */
export function checkImageExists(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!url) {
      resolve(false);
      return;
    }
    
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

/**
 * Preload images for better user experience
 * @param urls - Array of image URLs to preload
 */
export function preloadImages(urls: string[]): void {
  urls.forEach(url => {
    if (isValidImageUrl(url)) {
      const img = new Image();
      img.src = url;
    }
  });
}

/**
 * Get image dimensions from URL
 * @param url - Image URL
 * @returns Promise that resolves to image dimensions
 */
export function getImageDimensions(url: string): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    if (!isValidImageUrl(url)) {
      resolve(null);
      return;
    }
    
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

/**
 * Create a responsive image srcset
 * @param baseUrl - Base image URL
 * @param widths - Array of widths for different screen sizes
 * @returns Srcset string
 */
export function createSrcSet(baseUrl: string, widths: number[]): string {
  if (!isValidImageUrl(baseUrl)) return '';
  
  return widths
    .map(width => `${getOptimizedImageUrl(baseUrl, width, 0)} ${width}w`)
    .join(', ');
}
