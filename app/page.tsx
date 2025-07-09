'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Zap, 
  Wifi, 
  Lock, 
  Star, 
  ArrowRight,
  CheckCircle,
  Users,
  Award,
  Truck
} from 'lucide-react';
import Link from 'next/link';
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

export default function HomePage() {
  const { t, language, isRTL } = useLanguage();
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
      if (data) setProducts(data);
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
      if (data) setCategories(data);
    };
    fetchCategories();
  }, []);

  const featuredProducts = products.filter(product => product.featured);

  const features = [
    {
      icon: Shield,
      title: language === 'ar' ? 'أمان موثوق' : 'Trusted Security',
      description: language === 'ar' ? 'حلول أمان متقدمة لحماية منزلك وعملك' : 'Advanced security solutions to protect your home and business',
    },
    {
      icon: Zap,
      title: language === 'ar' ? 'طاقة مستدامة' : 'Sustainable Energy',
      description: language === 'ar' ? 'أنظمة طاقة شمسية صديقة للبيئة' : 'Eco-friendly solar energy systems',
    },
    {
      icon: Wifi,
      title: language === 'ar' ? 'اتصال سريع' : 'Fast Connectivity',
      description: language === 'ar' ? 'أجهزة إنترنت عالية السرعة' : 'High-speed internet devices',
    },
    {
      icon: Lock,
      title: language === 'ar' ? 'تحكم ذكي' : 'Smart Control',
      description: language === 'ar' ? 'أنظمة تحكم ذكية متطورة' : 'Advanced smart control systems',
    },
  ];

  const stats = [
    {
      icon: Users,
      value: '1000+',
      label: language === 'ar' ? 'عميل راضي' : 'Happy Customers',
    },
    {
      icon: Award,
      value: '5+',
      label: language === 'ar' ? 'سنوات خبرة' : 'Years Experience',
    },
    {
      icon: CheckCircle,
      value: '99%',
      label: language === 'ar' ? 'معدل الرضا' : 'Satisfaction Rate',
    },
    {
      icon: Truck,
      value: '24/7',
      label: language === 'ar' ? 'دعم فني' : 'Technical Support',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-fawaz-orange-500 via-fawaz-orange-400 to-fawaz-green-500">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className={`text-white ${isRTL ? 'text-right' : 'text-left'}`}
            >
              <Badge className="mb-6 bg-white/20 text-white border-white/30">
                <Star className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'الأفضل في العراق' : 'Best in Iraq'}
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                {t('home.hero.title')}
              </h1>
              <p className="text-xl mb-8 text-white/90 leading-relaxed">
                {t('home.hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products">
                  <Button size="lg" className="bg-white text-fawaz-orange-500 hover:bg-gray-100 font-semibold px-8 py-4 text-lg">
                    {t('home.hero.cta')}
                    <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline" className="border-white text-black hover:bg-white hover:text-fawaz-orange-500 px-8 py-4 text-lg">
                    {t('home.hero.learn')}
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/430208/pexels-photo-430208.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Security Camera"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
              {/* Floating Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-fawaz-green-100 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-fawaz-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">24/7 {language === 'ar' ? 'مراقبة' : 'Monitoring'}</p>
                    <p className="text-sm text-gray-600">{language === 'ar' ? 'حماية مستمرة' : 'Continuous Protection'}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-fawaz-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-fawaz-orange-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`text-center mb-16 ${isRTL ? 'text-right' : 'text-left'}`}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 gradient-text">
              {language === 'ar' ? 'لماذا تختار مكتب فواز؟' : 'Why Choose Fawaz Office?'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {language === 'ar' 
                ? 'نقدم حلول تقنية متطورة مع خدمة عملاء استثنائية وضمان الجودة'
                : 'We provide cutting-edge technology solutions with exceptional customer service and quality assurance'
              }
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full text-center p-6 hover:shadow-xl transition-all duration-300 border-0 shadow-lg group hover:-translate-y-2">
                    <CardContent className="p-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-fawaz-orange-100 to-fawaz-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-8 h-8 text-fawaz-orange-600" />
                      </div>
                      <h3 className="text-xl font-semibold mb-4 text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 gradient-text">
              {t('nav.categories')}
            </h2>
            <p className="text-xl text-gray-600">
              {language === 'ar' 
                ? 'استكشف مجموعتنا الواسعة من المنتجات التقنية المتطورة'
                : 'Explore our wide range of advanced technology products'
              }
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/categories/${category.id}`}>
                  <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={category.image && category.image.trim() !== '' ? category.image : '/default.png'}
                        alt={language === 'ar' ? category.nameAr : category.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h3 className="text-xl font-bold mb-2">
                          {language === 'ar' ? category.nameAr : category.name}
                        </h3>
                        <p className="text-sm opacity-90">
                          {language === 'ar' ? category.descriptionAr : category.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 gradient-text">
              {language === 'ar' ? 'المنتجات المميزة' : 'Featured Products'}
            </h2>
            <p className="text-xl text-gray-600">
              {language === 'ar' 
                ? 'اكتشف أفضل منتجاتنا المختارة بعناية'
                : 'Discover our carefully selected best products'
              }
            </p>
          </motion.div>

          {featuredProducts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product, index) => (
                <ProductCard key={index} product={product} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              {language === 'ar' ? 'لا توجد منتجات مميزة متاحة حالياً.' : 'No featured products available at the moment.'}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mt-12"
          >
            <Link href="/products">
              <Button size="lg" className="btn-primary px-8 py-4 text-lg">
                {t('common.viewAll')}
                <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-fawaz-orange-500 to-fawaz-green-500">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-white"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              {language === 'ar' 
                ? 'جاهز لتأمين منزلك أو عملك؟'
                : 'Ready to Secure Your Home or Business?'
              }
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {language === 'ar' 
                ? 'تواصل معنا اليوم للحصول على استشارة مجانية وعرض أسعار مخصص'
                : 'Contact us today for a free consultation and personalized quote'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-fawaz-orange-500 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                  {t('contact.title')}
                </Button>
              </Link>
              <Link href="/products">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-fawaz-orange-500 px-8 py-4 text-lg">
                  {t('nav.products')}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}