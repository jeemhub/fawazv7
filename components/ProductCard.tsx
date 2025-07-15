'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Eye, Star } from 'lucide-react';
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
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
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
          <div className="relative h-48 w-full">
            <Image
              src={product.image && product.image.trim() !== '' ? product.image : '/default.png'}
              alt={language === 'ar' ? product.nameAr : product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.featured && (
              <Badge className="bg-fawaz-orange-500 hover:bg-fawaz-orange-600 text-white">
                <Star className="w-3 h-3 mr-1" />
                {language === 'ar' ? 'مميز' : 'Featured'}
              </Badge>
            )}
            {!product.inStock && (
              <Badge variant="destructive">
                {t('product.outOfStock')}
              </Badge>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex flex-col gap-2">
              <Link href={`/products/${product.id}`}>
                <Button size="icon" variant="secondary" className="h-8 w-8 bg-white/90 hover:bg-white">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-fawaz-orange-500 transition-colors">
              {language === 'ar' ? product.nameAr : product.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {language === 'ar' ? product.descriptionAr : product.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-fawaz-green-600">
                {product.price} د.ع
              </span>
              <Badge variant="outline" className="text-xs">
                {language === 'ar' ? 'متوفر' : 'In Stock'}
              </Badge>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <div className="flex gap-2 w-full">
            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex-1 btn-primary"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {t('product.addToCart')}
            </Button>
            <Link href={`/products/${product.id}`} className="flex-1">
              <Button variant="outline" className="w-full border-fawaz-green-500 text-fawaz-green-600 hover:bg-fawaz-green-50">
                {t('product.viewDetails')}
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}