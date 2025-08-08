'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSearch } from '@/contexts/SearchContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Search, Filter, Grid, List, ChevronDown, X, SlidersHorizontal, Package } from 'lucide-react';
import productsData from '@/data/products.json'; // فقط للفئات
import { supabase } from '@/lib/supabaseClient';
import { useSearchParams } from 'next/navigation';

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
  const { t, language, isRTL } = useLanguage();
  const { searchTerm, setSearchTerm, clearSearch } = useSearch();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // عند تحميل الصفحة: إذا كان هناك category أو search في الكويري، فعّل الفلترة تلقائياً
  useEffect(() => {
    const categoryFromQuery = searchParams.get('category');
    const searchFromQuery = searchParams.get('search');
    
    if (categoryFromQuery) {
      setSelectedCategory(categoryFromQuery);
    }
    
    if (searchFromQuery) {
      setSearchTerm(decodeURIComponent(searchFromQuery));
    }
  }, [searchParams, setSearchTerm]);

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

  const clearAllFilters = () => {
    clearSearch();
    setSelectedCategory('all');
    setSortBy('name');
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || sortBy !== 'name';

  const getSelectedCategoryName = () => {
    if (selectedCategory === 'all') {
      return language === 'ar' ? 'جميع الفئات' : 'All Categories';
    }
    const category = categories.find(c => c.id === selectedCategory);
    return category ? (language === 'ar' ? category.nameAr : category.name) : '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Page Header */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-4 md:py-6 lg:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`text-${isRTL ? 'right' : 'left'}`}
          >
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3 lg:mb-4 gradient-text">
              {t('nav.products')}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-4xl">
              {language === 'ar' 
                ? 'اكتشف مجموعتنا الكاملة من المنتجات التقنية المتطورة'
                : 'Discover our complete range of advanced technology products'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mobile Search Bar */}
      <section className="bg-white border-b md:hidden">
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder={t('common.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 border-gray-300 focus:border-fawaz-orange-500 focus:ring-fawaz-orange-500 text-sm"
            />
          </div>
        </div>
      </section>

      {/* Mobile Filters Toggle */}
      <section className="bg-white border-b md:hidden">
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 text-sm">
                  <Filter className="h-4 w-4" />
                  {language === 'ar' ? 'المرشحات' : 'Filters'}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side={isRTL ? "left" : "right"} className="w-80">
                <div className="space-y-6 pt-6">
                  <h3 className="text-lg font-semibold">{language === 'ar' ? 'المرشحات' : 'Filters'}</h3>
                  
                  {/* Categories */}
                  <div>
                    <h4 className="font-medium mb-3">{language === 'ar' ? 'الفئات' : 'Categories'}</h4>
                    <div className="space-y-2">
                      <Button
                        variant={selectedCategory === 'all' ? 'default' : 'outline'}
                        onClick={() => setSelectedCategory('all')}
                        className="w-full justify-start text-sm"
                      >
                        {language === 'ar' ? 'جميع الفئات' : 'All Categories'}
                      </Button>
                      {categoriesWithProducts.map(category => (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.id ? 'default' : 'outline'}
                          onClick={() => setSelectedCategory(category.id)}
                          className="w-full justify-start text-sm"
                        >
                          {language === 'ar' ? category.nameAr : category.name}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Sort */}
                  <div>
                    <h4 className="font-medium mb-3">{language === 'ar' ? 'الترتيب' : 'Sort'}</h4>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-full">
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

                  {/* Clear Filters */}
                  {hasActiveFilters && (
                    <Button
                      onClick={() => {
                        clearAllFilters();
                        setIsFiltersOpen(false);
                      }}
                      variant="outline"
                      className="w-full text-sm"
                    >
                      {language === 'ar' ? 'مسح جميع المرشحات' : 'Clear All Filters'}
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* Results Count */}
            <span className="text-sm text-gray-600">
              {filteredAndSortedProducts.length} {language === 'ar' ? 'منتج' : 'products'}
            </span>
          </div>
        </div>
      </section>

      {/* Desktop Enhanced Search and Filters */}
      <section className="bg-white border-b hidden md:block">
        <div className="container mx-auto px-6 lg:px-8 xl:px-12 py-6">
          {/* Enhanced Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder={language === 'ar' ? 'ابحث عن المنتجات...' : 'Search for products...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg border-2 border-gray-200 focus:border-fawaz-orange-500 focus:ring-fawaz-orange-500 rounded-xl shadow-sm"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Enhanced Filters Bar */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* Category and Sort Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6 w-full lg:w-auto">
              {/* Category Dropdown */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-sm font-medium text-gray-700 flex items-center gap-2 whitespace-nowrap">
                  <Package className="h-4 w-4" />
                  {language === 'ar' ? 'الفئة:' : 'Category:'}
                </span>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-64 border-2 border-gray-200 focus:border-fawaz-orange-500 rounded-lg">
                    <SelectValue placeholder={language === 'ar' ? 'اختر الفئة' : 'Select Category'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {language === 'ar' ? 'جميع الفئات' : 'All Categories'}
                    </SelectItem>
                    {categoriesWithProducts.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {language === 'ar' ? category.nameAr : category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  {language === 'ar' ? 'ترتيب:' : 'Sort:'}
                </span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48 border-2 border-gray-200 focus:border-fawaz-orange-500 rounded-lg">
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

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8 w-8 p-0"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Active Filters Display */}
          {(hasActiveFilters || searchTerm) && (
            <div className="flex items-center gap-3 mt-4 pt-4 border-t">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                {language === 'ar' ? 'المرشحات النشطة:' : 'Active filters:'}
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {selectedCategory !== 'all' && (
                  <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1">
                    <Package className="h-3 w-3" />
                    <span className="truncate max-w-32">{getSelectedCategoryName()}</span>
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className="ml-1 hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {searchTerm && (
                  <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1">
                    <Search className="h-3 w-3" />
                    <span className="truncate max-w-32">"{searchTerm}"</span>
                    <button
                      onClick={() => setSearchTerm('')}
                      className="ml-1 hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {hasActiveFilters && (
                  <Button
                    onClick={clearAllFilters}
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 text-sm"
                  >
                    {language === 'ar' ? 'مسح الكل' : 'Clear All'}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-4 md:py-6 lg:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          {/* Desktop Results Count */}
          <div className="mb-4 md:mb-6 hidden md:block">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 text-sm">
                {language === 'ar' 
                  ? `عرض ${filteredAndSortedProducts.length} من ${products.length} منتج`
                  : `Showing ${filteredAndSortedProducts.length} of ${products.length} products`}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <SlidersHorizontal className="h-4 w-4" />
                <span>{language === 'ar' ? 'مرشحات نشطة' : 'Active filters'}: {hasActiveFilters ? 'نعم' : 'لا'}</span>
              </div>
            </div>
          </div>
          
          {/* Products */}
          {filteredAndSortedProducts.length > 0 ? (
            <div className={`grid gap-4 md:gap-6 lg:gap-8 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5' 
                : 'grid-cols-1'
            }`}>
              {filteredAndSortedProducts.map((product, index) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  index={index}
                  viewMode={viewMode}
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8 md:py-12 lg:py-16"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Search className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-gray-400" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                {language === 'ar' ? 'لم يتم العثور على منتجات' : 'No products found'}
              </h3>
              <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base max-w-md mx-auto">
                {language === 'ar' 
                  ? 'جرب تغيير معايير البحث أو المرشحات'
                  : 'Try adjusting your search criteria or filters'}
              </p>
              <Button
                onClick={clearAllFilters}
                className="btn-primary text-sm"
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