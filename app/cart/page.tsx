'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft,
  CreditCard,
  ShoppingBag,
  Package,
  Shield,
  Truck
} from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { t, language, isRTL } = useLanguage();
  const { items, updateQuantity, removeFromCart, getTotalPrice, getTotalItems, clearCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-fawaz-orange-100 to-fawaz-green-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <ShoppingCart className="w-16 h-16 text-fawaz-orange-500" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-6 gradient-text">
                {t('cart.empty')}
              </h1>
              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                {language === 'ar' 
                  ? 'ابدأ رحلة التسوق الرائعة معنا واكتشف منتجاتنا المميزة'
                  : 'Start your amazing shopping journey with us and discover our amazing products'
                }
              </p>
              <Link href="/products">
                <Button className="btn-primary text-lg px-8 py-4">
                  <ShoppingBag className={`w-5 h-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                  {language === 'ar' ? 'ابدأ التسوق الآن' : 'Start Shopping Now'}
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      {/* Page Header */}
      <section className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
          >
            <div className="flex-1">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 gradient-text">
                {t('cart.title')}
              </h1>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-fawaz-orange-500" />
                  <span className="font-medium">
                    {getTotalItems()} {language === 'ar' ? 'عنصر في السلة' : 'items in your cart'}
                  </span>
                </div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span className="text-fawaz-green-600 font-semibold">
                  {formatPrice(getTotalPrice())}
                </span>
              </div>
            </div>
            <Link href="/products">
              <Button variant="outline" className="border-fawaz-green-500 text-fawaz-green-600 hover:bg-fawaz-green-50 px-6 py-3">
                <ArrowLeft className={`w-5 h-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                {language === 'ar' ? 'متابعة التسوق' : 'Continue Shopping'}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 xl:gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group"
                >
                  <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                    <CardContent className="p-8">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        {/* Product Image */}
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={language === 'ar' ? item.nameAr : item.name}
                            fill
                            className="object-cover rounded-xl shadow-md"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-xl"></div>
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0 space-y-3">
                          <div>
                            <h3 className="font-bold text-xl text-gray-900 truncate">
                              {language === 'ar' ? item.nameAr : item.name}
                            </h3>
                            <div className="flex items-center gap-3 mt-2">
                              <Badge variant="secondary" className="bg-fawaz-orange-100 text-fawaz-orange-700">
                                {item.category}
                              </Badge>
                              <span className="text-2xl font-bold text-fawaz-green-600">
                                {formatPrice(item.price)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          <div className="flex items-center bg-gray-50 rounded-lg p-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-10 w-10 hover:bg-white hover:shadow-sm"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-16 text-center font-bold text-lg">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-10 w-10 hover:bg-white hover:shadow-sm"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Item Total */}
                          <div className="text-center sm:text-right">
                            <p className="font-bold text-2xl text-gray-900 mb-2">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              {t('cart.remove')}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {/* Clear Cart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-center pt-6"
              >
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300 px-8 py-3 rounded-lg transition-all duration-300"
                >
                  <Trash2 className="h-5 w-5 mr-3" />
                  {language === 'ar' ? 'تفريغ السلة' : 'Clear Cart'}
                </Button>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="sticky top-24"
              >
                <Card className="border-0 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-fawaz-orange-50 to-fawaz-green-50 pb-6">
                    <CardTitle className="gradient-text text-2xl flex items-center gap-3">
                      <ShoppingCart className="w-6 h-6" />
                      {language === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {/* Items Summary */}
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {language === 'ar' ? item.nameAr : item.name}
                            </p>
                            <p className="text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <span className="font-bold text-fawaz-green-600 ml-3">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-6" />

                    {/* Totals */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">{language === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                        <span className="font-semibold text-lg">{formatPrice(getTotalPrice())}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">{language === 'ar' ? 'الشحن' : 'Shipping'}</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-700 font-medium">
                          <Truck className="w-3 h-3 mr-1" />
                          {language === 'ar' ? 'مجاني' : 'Free'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">{language === 'ar' ? 'الضريبة' : 'Tax'}</span>
                        <span className="font-semibold">
                          {formatPrice(getTotalPrice() * 0.15)}
                        </span>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    {/* Grand Total */}
                    <div className="flex justify-between items-center text-xl font-bold bg-gradient-to-r from-fawaz-orange-50 to-fawaz-green-50 p-4 rounded-lg">
                      <span className="gradient-text">{t('cart.total')}</span>
                      <span className="text-2xl text-fawaz-green-600">
                        {formatPrice(getTotalPrice() * 1.15)}
                      </span>
                    </div>

                    {/* Checkout Button */}
                    <Button className="w-full btn-primary text-lg py-6 rounded-xl shadow-lg hover:shadow-xl">
                      <CreditCard className="w-6 h-6 mr-3" />
                      {t('cart.checkout')}
                    </Button>

                    {/* Security Badge */}
                    <div className="text-center text-sm text-gray-500 mt-6 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-green-500" />
                        <span className="font-medium">
                          {language === 'ar' ? 'دفع آمن ومشفر' : 'Secure & Encrypted Payment'}
                        </span>
                      </div>
                      <p className="text-xs">
                        {language === 'ar' 
                          ? 'جميع المعاملات محمية بتقنية SSL المتقدمة'
                          : 'All transactions are protected with advanced SSL technology'
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}