"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImageCarousel from "@/components/ImageCarousel";
import ThumbnailGallery from "@/components/ThumbnailGallery";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, Image, Smartphone, Monitor } from "lucide-react";

export default function CarouselDemoPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);

  // Sample product images for demo
  const sampleImages = [
    "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop&sat=-100",
    "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop&hue=180",
    "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop&contrast=150",
    "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop&brightness=150"
  ];

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Image Carousel Demo
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              تجربة نظام عرض الصور المتعددة مع دعم كامل للشاشات المختلفة والتفاعل باللمس
            </p>
          </div>

          {/* Demo Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Carousel Settings
              </CardTitle>
              <CardDescription>
                تخصيص إعدادات الكاروسيل
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button
                  variant={showFullscreen ? "default" : "outline"}
                  onClick={() => setShowFullscreen(!showFullscreen)}
                  className="flex items-center gap-2"
                >
                  <Image className="w-4 h-4" />
                  {showFullscreen ? "Hide Fullscreen" : "Show Fullscreen"}
                </Button>
                <Button
                  variant={autoPlay ? "default" : "outline"}
                  onClick={() => setAutoPlay(!autoPlay)}
                  className="flex items-center gap-2"
                >
                  <Monitor className="w-4 h-4" />
                  {autoPlay ? "Disable Auto-play" : "Enable Auto-play"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Main Carousel Demo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="w-5 h-5" />
                Main Image Carousel
              </CardTitle>
              <CardDescription>
                الكاروسيل الرئيسي مع معرض الصور المصغرة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Carousel Section */}
                <div className="lg:col-span-2">
                  <div className="relative h-80 md:h-96 lg:h-[500px] bg-gray-100 rounded-lg overflow-hidden">
                    <ImageCarousel
                      images={sampleImages}
                      alt="Sample Product Images"
                      className="w-full h-full"
                      showFullscreen={showFullscreen}
                    />
                  </div>
                  
                  {/* Thumbnail Gallery */}
                  <ThumbnailGallery
                    images={sampleImages}
                    currentIndex={currentIndex}
                    onThumbnailClick={handleThumbnailClick}
                    className="mt-4"
                  />
                </div>

                {/* Info Section */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Features</h3>
                    <div className="space-y-2">
                      <Badge variant="secondary" className="w-full justify-start">
                        <Smartphone className="w-3 h-3 mr-2" />
                        Touch & Swipe Support
                      </Badge>
                      <Badge variant="secondary" className="w-full justify-start">
                        <Monitor className="w-3 h-3 mr-2" />
                        Responsive Design
                      </Badge>
                      <Badge variant="secondary" className="w-full justify-start">
                        <Image className="w-3 h-3 mr-2" />
                        Fullscreen Mode
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">Navigation</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>• Click arrows to navigate</p>
                      <p>• Click dots for quick access</p>
                      <p>• Swipe on mobile devices</p>
                      <p>• Use keyboard arrows</p>
                      <p>• Press ESC to exit fullscreen</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">Current Image</h3>
                    <p className="text-sm text-gray-600">
                      {currentIndex + 1} of {sampleImages.length}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Responsive Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Responsive Design Demo</CardTitle>
              <CardDescription>
                تجربة التصميم المتجاوب على أحجام شاشات مختلفة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Mobile View */}
                <div className="text-center">
                  <div className="w-32 h-64 mx-auto bg-gray-200 rounded-lg overflow-hidden mb-4">
                    <ImageCarousel
                      images={sampleImages.slice(0, 3)}
                      alt="Mobile Demo"
                      className="w-full h-full"
                      showFullscreen={false}
                    />
                  </div>
                  <h4 className="font-semibold">Mobile View</h4>
                  <p className="text-sm text-gray-600">Touch & Swipe</p>
                </div>

                {/* Tablet View */}
                <div className="text-center">
                  <div className="w-48 h-48 mx-auto bg-gray-200 rounded-lg overflow-hidden mb-4">
                    <ImageCarousel
                      images={sampleImages.slice(0, 4)}
                      alt="Tablet Demo"
                      className="w-full h-full"
                      showFullscreen={false}
                    />
                  </div>
                  <h4 className="font-semibold">Tablet View</h4>
                  <p className="text-sm text-gray-600">Touch & Click</p>
                </div>

                {/* Desktop View */}
                <div className="text-center">
                  <div className="w-64 h-48 mx-auto bg-gray-200 rounded-lg overflow-hidden mb-4">
                    <ImageCarousel
                      images={sampleImages}
                      alt="Desktop Demo"
                      className="w-full h-full"
                      showFullscreen={false}
                    />
                  </div>
                  <h4 className="font-semibold">Desktop View</h4>
                  <p className="text-sm text-gray-600">Mouse & Keyboard</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Examples */}
          <Card>
            <CardHeader>
              <CardTitle>Code Examples</CardTitle>
              <CardDescription>
                أمثلة على كيفية استخدام الكاروسيل
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Basic Usage</h4>
                  <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`import ImageCarousel from "@/components/ImageCarousel";

<ImageCarousel
  images={product.images}
  alt={product.name}
  className="w-full h-full"
/>`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">With Thumbnails</h4>
                  <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`import ThumbnailGallery from "@/components/ThumbnailGallery";

<ThumbnailGallery
  images={product.images}
  currentIndex={currentIndex}
  onThumbnailClick={handleThumbnailClick}
/>`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Custom Configuration</h4>
                  <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`<ImageCarousel
  images={product.images}
  alt={product.name}
  className="w-full h-full"
  showFullscreen={true}
/>`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
