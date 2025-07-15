'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Grid, List } from 'lucide-react';
import productsData from '@/data/products.json'; // فقط للفئات
import { supabase } from '@/lib/supabaseClient';

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

interface Category {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  image: string;
}

export default function ProductsPage() {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching products:', error);
        alert('حدث خطأ أثناء جلب المنتجات');
        return;
      }
      if (data) {
        const mapped = data.map((product: any) => ({
          ...product,
          image: product.image_url && product.image_url.trim() !== '' ? product.image_url : '/default.png',
        }));
        setProducts(mapped);
      }
    };
    fetchProducts();
    // جلب الفئات من supabase
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('id', { ascending: true });
      if (error) {
        console.error('Error fetching categories:', error);
        alert('حدث خطأ أثناء جلب الفئات');
        return;
      }
      if (data) {
        const mapped = data.map((category: any) => ({
          ...category,
          image: category.image_url && category.image_url.trim() !== '' ? category.image_url : '/default.png',
        }));
        setCategories(mapped);
      }
    };
    fetchCategories();
  }, []);

  // الفئات التي لديها منتجات فقط
  const categoriesWithProducts = useMemo(() => {
    return categories.filter(category =>
      products.some(product => product.category === category.id)
    );
  }, [categories, products]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = searchTerm === '' || 
        (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.nameAr && product.nameAr.includes(searchTerm)) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.descriptionAr && product.descriptionAr.includes(searchTerm));
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return language === 'ar' 
            ? a.nameAr.localeCompare(b.nameAr)
            : a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'featured':
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        default:
          return 0;
      }
    });
    return filtered;
  }, [products, searchTerm, selectedCategory, sortBy, language]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Page Header */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl lg:text-4xl font-bold mb-4 gradient-text">
              {t('nav.products')}
            </h1>
            <p className="text-lg text-gray-600">
              {language === 'ar' 
                ? 'اكتشف مجموعتنا الكاملة من المنتجات التقنية المتطورة'
                : 'Discover our complete range of advanced technology products'}
            </p>
          </motion.div>
        </div>
      </section>
      {/* Filters and Search */}
      <section className="bg-white border-b sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder={t('common.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 focus:border-fawaz-orange-500 focus:ring-fawaz-orange-500"
              />
            </div>
            {/* Filters */}
            <div className="flex items-center gap-4">
              {/* Category Filter */}
              <div className="flex gap-2 flex-wrap">
                {categoriesWithProducts.map(category => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(category.id)}
                    className="px-4 py-2"
                  >
                    {language === 'ar' ? category.nameAr : category.name}
                  </Button>
                ))}
                {/* زر إظهار الكل فقط إذا كان هناك أكثر من فئة */}
                {categoriesWithProducts.length > 1 && (
                  <Button
                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory('all')}
                    className="px-4 py-2"
                  >
                    {language === 'ar' ? 'جميع الفئات' : 'All Categories'}
                  </Button>
                )}
              </div>
              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder={language === 'ar' ? 'ترتيب حسب' : 'Sort by'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">
                    {language === 'ar' ? 'الاسم' : 'Name'}
                  </SelectItem>
                  <SelectItem value="price-low">
                    {language === 'ar' ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}
                  </SelectItem>
                  <SelectItem value="price-high">
                    {language === 'ar' ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}
                  </SelectItem>
                  <SelectItem value="featured">
                    {language === 'ar' ? 'المميزة أولاً' : 'Featured First'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Active Filters */}
          <div className="flex items-center gap-2 mt-4">
            {selectedCategory !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-2">
                {categories.find(c => c.id === selectedCategory)?.[language === 'ar' ? 'nameAr' : 'name']}
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="ml-1 hover:text-red-500"
                >
                  ×
                </button>
              </Badge>
            )}
            {searchTerm && (
              <Badge variant="secondary" className="flex items-center gap-2">
                "{searchTerm}"
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-1 hover:text-red-500"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        </div>
      </section>
      {/* Products Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              {language === 'ar' 
                ? `عرض ${filteredAndSortedProducts.length} من ${products.length} منتج`
                : `Showing ${filteredAndSortedProducts.length} of ${products.length} products`}
            </p>
          </div>
          {/* Products */}
          {filteredAndSortedProducts.length > 0 ? (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredAndSortedProducts.map((product, index) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  index={index}
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {language === 'ar' ? 'لم يتم العثور على منتجات' : 'No products found'}
              </h3>
              <p className="text-gray-600 mb-6">
                {language === 'ar' 
                  ? 'جرب تغيير معايير البحث أو المرشحات'
                  : 'Try adjusting your search criteria or filters'}
              </p>
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="btn-primary"
              >
                {language === 'ar' ? 'مسح المرشحات' : 'Clear Filters'}
              </Button>
            </motion.div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}