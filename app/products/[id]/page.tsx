"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, ArrowLeft, Heart, Share2 } from "lucide-react";
import ImageCarousel from "@/components/ImageCarousel";
import ThumbnailGallery from "@/components/ThumbnailGallery";

interface Product {
  id: string;
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
  price: number;
  category_id: string;
  image_url: string;
  additional_images: string[];
  in_stock: boolean;
  featured?: boolean;
  category?: {
    name: string;
    name_ar: string;
  };
}

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const { data, error } = await supabase
          .from("products")
          .select(`
            *,
            category:categories(name, name_ar)
          `)
          .eq("id", id)
          .single();

        if (error || !data) {
          setError(language === "ar" ? "لم يتم العثور على المنتج" : "Product not found");
          setLoading(false);
          return;
        }

        // Process images - combine main image with additional images
        const allImages: string[] = [];
        if (data.image_url && data.image_url.trim() !== "") {
          allImages.push(data.image_url);
        }
        
        // Handle additional_images as comma-separated string
        if (data.additional_images && typeof data.additional_images === 'string') {
          // Split by comma and trim whitespace
          const additionalImages: string[] = data.additional_images
            .split(',')
            .map((img: string) => img.trim())
            .filter((img: string) => img.length > 0);
          
          allImages.push(...additionalImages);
        } else if (data.additional_images && Array.isArray(data.additional_images)) {
          // Fallback for array format
          allImages.push(...data.additional_images);
        }
        
        if (allImages.length === 0) {
          allImages.push("/default.png");
        }

        setProduct({
          ...data,
          additional_images: allImages,
        });
      } catch (err) {
        setError(language === "ar" ? "حدث خطأ أثناء تحميل المنتج" : "Error loading product");
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id, language]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: language === "ar" ? product.name_ar : product.name,
        nameAr: product.name_ar,
        price: product.price,
        image: product.additional_images[0] || "/default.png",
        category: product.category?.name || "",
      });
    }
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: language === "ar" ? product?.name_ar : product?.name,
          text: language === "ar" ? product?.description_ar : product?.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-4xl">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Loading skeleton for image */}
                <div className="flex-1">
                  <div className="w-full h-64 md:h-80 bg-gray-200 rounded-xl animate-pulse" />
                </div>
                {/* Loading skeleton for content */}
                <div className="flex-1 space-y-4">
                  <div className="h-8 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2" />
                  <div className="h-12 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-md text-center">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {language === "ar" ? "خطأ" : "Error"}
              </h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => router.back()} variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {language === "ar" ? "رجوع" : "Go Back"}
                </Button>
                <Button onClick={() => router.push("/")}>
                  {language === "ar" ? "الرئيسية" : "Home"}
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) return null;

  const productName = language === "ar" ? product.name_ar : product.name;
  const productDescription = language === "ar" ? product.description_ar : product.description;
  const categoryName = language === "ar" ? product.category?.name_ar : product.category?.name;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-6 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <button 
                  onClick={() => router.push("/")}
                  className="hover:text-fawaz-green-600 transition-colors"
                >
                  {language === "ar" ? "الرئيسية" : "Home"}
                </button>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                <button 
                  onClick={() => router.push("/categories")}
                  className="hover:text-fawaz-green-600 transition-colors"
                >
                  {language === "ar" ? "التصنيفات" : "Categories"}
                </button>
              </li>
              {categoryName && (
                <>
                  <li className="text-gray-400">/</li>
                  <li className="text-gray-900">{categoryName}</li>
                </>
              )}
            </ol>
          </nav>

          {/* Product Content */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Image Section */}
              <div className="p-6 md:p-8 bg-gray-50">
                <div className="relative h-80 md:h-96 lg:h-[500px]">
                  <ImageCarousel
                    images={product.additional_images}
                    alt={productName}
                    className="w-full h-full"
                  />
                </div>
                
                {/* Thumbnail Gallery */}
                <ThumbnailGallery
                  images={product.additional_images}
                  currentIndex={currentImageIndex}
                  onThumbnailClick={handleThumbnailClick}
                  className="mt-4"
                />
              </div>

              {/* Product Details */}
              <div className="p-6 md:p-8 flex flex-col justify-between">
                <div className="space-y-6">
                  {/* Header */}
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                        {productName}
                      </h1>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIsWishlisted(!isWishlisted)}
                          className={`p-2 rounded-full transition-colors ${
                            isWishlisted 
                              ? "text-red-500 bg-red-50" 
                              : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                          }`}
                          aria-label={language === "ar" ? "إضافة للمفضلة" : "Add to wishlist"}
                        >
                          <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                        </button>
                        <button
                          onClick={handleShare}
                          className="p-2 rounded-full text-gray-400 hover:text-fawaz-green-600 hover:bg-fawaz-green-50 transition-colors"
                          aria-label={language === "ar" ? "مشاركة" : "Share"}
                        >
                          <Share2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      {product.featured && (
                        <Badge className="bg-fawaz-orange-500 text-white flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          {language === "ar" ? "مميز" : "Featured"}
                        </Badge>
                      )}
                      <Badge 
                        variant={product.in_stock ? "default" : "destructive"}
                        className={product.in_stock ? "bg-fawaz-green-500" : ""}
                      >
                        {product.in_stock 
                          ? (language === "ar" ? "متوفر" : "In Stock")
                          : (language === "ar" ? "غير متوفر" : "Out of Stock")
                        }
                      </Badge>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-4">
                    <span className="text-3xl md:text-4xl font-bold text-fawaz-green-600">
                      {product.price.toLocaleString()} د.ع
                    </span>
                    {product.in_stock && (
                      <span className="text-sm text-gray-500">
                        {language === "ar" ? "شامل الضريبة" : "Including VAT"}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {language === "ar" ? "الوصف" : "Description"}
                    </h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {productDescription}
                    </p>
                  </div>

                  {/* Category */}
                  {categoryName && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {language === "ar" ? "التصنيف" : "Category"}
                      </h3>
                      <Badge variant="outline" className="text-base px-3 py-1">
                        {categoryName}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-4 pt-6 border-t border-gray-200">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!product.in_stock}
                    className="w-full btn-primary text-lg py-4 h-auto"
                    size="lg"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {product.in_stock 
                      ? (language === "ar" ? "إضافة للسلة" : "Add to Cart")
                      : (language === "ar" ? "غير متوفر" : "Out of Stock")
                    }
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => router.back()}
                      className="h-12"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      {language === "ar" ? "رجوع" : "Back"}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => router.push("/cart")}
                      className="h-12"
                    >
                      {language === "ar" ? "عرض السلة" : "View Cart"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}