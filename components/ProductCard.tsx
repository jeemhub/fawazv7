'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Eye, Star, Heart } from 'lucide-react';
import Link from 'next/link';

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

interface ProductCardProps {
  product: Product;
  index?: number;
  viewMode?: 'grid' | 'list';
}

export default function ProductCard({ product, index = 0, viewMode = 'grid' }: ProductCardProps) {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      id: product.id,
      name: product.name,
      nameAr: product.nameAr,
      price: product.price,
      image: product.image,
      category: product.category,
    });
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} د.ع`;
  };

  // List View Layout
  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ y: -2 }}
        className="group"
      >
        <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6">
              {/* Product Image */}
              <div className="relative w-full sm:w-32 h-48 sm:h-32 flex-shrink-0 rounded-xl overflow-hidden">
                <Image
                  src={product.image && product.image.trim() !== '' ? product.image : '/default.png'}
                  alt={language === 'ar' ? product.nameAr : product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0 w-full">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg md:text-xl text-gray-900 group-hover:text-fawaz-orange-500 transition-colors leading-tight mb-2">
                      {language === 'ar' ? product.nameAr : product.name}
                    </h3>
                    <p className="text-gray-600 leading-relaxed line-clamp-2 text-sm md:text-base">
                      {language === 'ar' ? product.descriptionAr : product.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 sm:ml-4">
                    {product.featured && (
                      <Badge className="bg-fawaz-orange-500 hover:bg-fawaz-orange-600 text-white text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        {language === 'ar' ? 'مميز' : 'Featured'}
                      </Badge>
                    )}
                    {!product.inStock && (
                      <Badge variant="destructive" className="text-xs">
                        {t('product.outOfStock')}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl md:text-2xl font-bold text-fawaz-green-600">
                      {formatPrice(product.price)}
                    </span>
                    <Badge variant="outline" className="text-xs bg-green-50 border-green-200 text-green-700">
                      {language === 'ar' ? 'متوفر' : 'In Stock'}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-col items-stretch sm:items-center gap-2 sm:gap-3">
                    <Link href={`/products/${product.id}`} className="flex-1 sm:flex-none">
                      <Button variant="outline" className="w-full sm:w-auto border-fawaz-green-500 text-fawaz-green-600 hover:bg-fawaz-green-50">
                        <Eye className="w-4 h-4 mr-2" />
                        {t('product.viewDetails')}
                      </Button>
                    </Link>
                    <Button
                      onClick={handleAddToCart}
                      disabled={!product.inStock}
                      className="btn-primary flex-1 sm:flex-none"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {t('product.addToCart')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Grid View Layout (Default)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white">
        <div className="relative overflow-hidden">
          {/* Product Image */}
          <div className="relative h-40 sm:h-48 md:h-56 w-full">
            <Image
              src={product.image && product.image.trim() !== '' ? product.image : '/default.png'}
              alt={language === 'ar' ? product.nameAr : product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.featured && (
              <Badge className="bg-fawaz-orange-500 hover:bg-fawaz-orange-600 text-white text-xs">
                <Star className="w-3 h-3 mr-1" />
                {language === 'ar' ? 'مميز' : 'Featured'}
              </Badge>
            )}
            {!product.inStock && (
              <Badge variant="destructive" className="text-xs">
                {t('product.outOfStock')}
              </Badge>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex flex-col gap-1">
              <Link href={`/products/${product.id}`}>
                <Button size="icon" variant="secondary" className="h-8 w-8 bg-white/90 hover:bg-white shadow-md">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <CardContent className="p-3 sm:p-4 md:p-5">
          <div className="space-y-2 md:space-y-3">
            <h3 className="font-semibold text-sm sm:text-base md:text-lg line-clamp-2 group-hover:text-fawaz-orange-500 transition-colors leading-tight">
              {language === 'ar' ? product.nameAr : product.name}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {language === 'ar' ? product.descriptionAr : product.description}
            </p>
            <div className="flex items-center justify-between pt-2">
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-fawaz-green-600">
                {formatPrice(product.price)}
              </span>
              <Badge variant="outline" className="text-xs bg-green-50 border-green-200 text-green-700">
                {language === 'ar' ? 'متوفر' : 'In Stock'}
              </Badge>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-3 sm:p-4 md:p-5 pt-0">
          <div className="flex flex-col gap-2 w-full">
            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex-1 btn-primary h-10 sm:h-11 md:h-12 text-sm font-medium"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {t('product.addToCart')}
            </Button>
            <Link href={`/products/${product.id}`} className="flex-1">
              <Button 
                variant="outline" 
                className="w-full h-10 sm:h-11 md:h-12 border-fawaz-green-500 text-fawaz-green-600 hover:bg-fawaz-green-50 text-sm font-medium"
              >
                {t('product.viewDetails')}
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}