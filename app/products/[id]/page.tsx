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
import { ShoppingCart, Star } from "lucide-react";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  category: string;
  image: string;
  inStock: boolean;
  featured?: boolean;
}

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      if (error || !data) {
        setError(language === "ar" ? "لم يتم العثور على المنتج" : "Product not found");
        setLoading(false);
        return;
      }
      setProduct({
        ...data,
        image: data.image_url && data.image_url.trim() !== "" ? data.image_url : "/default.png",
      });
      setLoading(false);
    };
    fetchProduct();
  }, [id, language]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        nameAr: product.nameAr,
        price: product.price,
        image: product.image,
        category: product.category,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6 md:p-10 flex flex-col md:flex-row gap-8">
          {loading ? (
            <div className="w-full text-center py-20">
              <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 animate-pulse mb-6" />
              <p className="text-lg text-gray-500">{language === "ar" ? "جاري التحميل..." : "Loading..."}</p>
            </div>
          ) : error ? (
            <div className="w-full text-center py-20">
              <p className="text-lg text-red-500">{error}</p>
              <Button className="mt-6" onClick={() => router.back()}>{language === "ar" ? "رجوع" : "Go Back"}</Button>
            </div>
          ) : product && (
            <>
              {/* Product Image */}
              <div className="flex-1 flex items-center justify-center">
                <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-xl overflow-hidden border bg-gray-50">
                  <Image
                    src={product.image}
                    alt={language === "ar" ? product.nameAr : product.name}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              {/* Product Details */}
              <div className="flex-1 flex flex-col justify-between gap-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2 gradient-text">
                    {language === "ar" ? product.nameAr : product.name}
                  </h1>
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    {product.featured && (
                      <Badge className="bg-fawaz-orange-500 text-white flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        {language === "ar" ? "مميز" : "Featured"}
                      </Badge>
                    )}
                    {!product.inStock && (
                      <Badge variant="destructive">
                        {t("product.outOfStock")}
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-700 text-lg mb-6 whitespace-pre-line">
                    {language === "ar" ? product.descriptionAr : product.description}
                  </p>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-3xl font-bold text-fawaz-green-600">
                      {product.price} د.ع
                    </span>
                    {product.inStock && (
                      <Badge variant="outline" className="text-xs">
                        {language === "ar" ? "متوفر" : "In Stock"}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="btn-primary text-lg py-4"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {t("product.addToCart")}
                  </Button>
                  <Button variant="outline" onClick={() => router.back()}>
                    {language === "ar" ? "رجوع" : "Back"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
} 