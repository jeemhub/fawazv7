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
  ShoppingBag
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
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-md mx-auto"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-12 h-12 text-gray-400" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {t('cart.empty')}
              </h1>
              <p className="text-gray-600 mb-8">
                {language === 'ar' 
                  ? 'ابدأ التسوق لإضافة منتجات إلى سلتك'
                  : 'Start shopping to add products to your cart'
                }
              </p>
              <Link href="/products">
                <Button className="btn-primary">
                  <ShoppingBag className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {language === 'ar' ? 'ابدأ التسوق' : 'Start Shopping'}
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Page Header */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2 gradient-text">
                {t('cart.title')}
              </h1>
              <p className="text-gray-600">
                {getTotalItems()} {language === 'ar' ? 'عنصر في السلة' : 'items in your cart'}
              </p>
            </div>
            <Link href="/products">
              <Button variant="outline" className="border-fawaz-green-500 text-fawaz-green-600 hover:bg-fawaz-green-50">
                <ArrowLeft className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {language === 'ar' ? 'متابعة التسوق' : 'Continue Shopping'}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        {/* Product Image */}
                        <div className="relative w-20 h-20 flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={language === 'ar' ? item.nameAr : item.name}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg text-gray-900 truncate">
                            {language === 'ar' ? item.nameAr : item.name}
                          </h3>
                          <p className="text-sm text-gray-500 capitalize">
                            {item.category}
                          </p>
                          <p className="text-lg font-bold text-fawaz-green-600 mt-1">
                            {formatPrice(item.price)}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-8 w-8"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="font-bold text-lg text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-2"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            {t('cart.remove')}
                          </Button>
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
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-center pt-4"
              >
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {language === 'ar' ? 'تفريغ السلة' : 'Clear Cart'}
                </Button>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="sticky top-24"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="gradient-text">
                      {language === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Items Summary */}
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="truncate flex-1 mr-2">
                            {language === 'ar' ? item.nameAr : item.name} × {item.quantity}
                          </span>
                          <span className="font-medium">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Totals */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>{language === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                        <span className="font-medium">{formatPrice(getTotalPrice())}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{language === 'ar' ? 'الشحن' : 'Shipping'}</span>
                        <Badge variant="secondary" className="bg-fawaz-green-100 text-fawaz-green-700">
                          {language === 'ar' ? 'مجاني' : 'Free'}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>{language === 'ar' ? 'الضريبة' : 'Tax'}</span>
                        <span className="font-medium">
                          {formatPrice(getTotalPrice() * 0.15)}
                        </span>
                      </div>
                    </div>

                    <Separator />

                    {/* Grand Total */}
                    <div className="flex justify-between text-lg font-bold">
                      <span>{t('cart.total')}</span>
                      <span className="text-fawaz-green-600">
                        {formatPrice(getTotalPrice() * 1.15)}
                      </span>
                    </div>

                    {/* Checkout Button */}
                    <Button className="w-full btn-primary text-lg py-6">
                      <CreditCard className="w-5 h-5 mr-2" />
                      {t('cart.checkout')}
                    </Button>

                    {/* Security Badge */}
                    <div className="text-center text-sm text-gray-500 mt-4">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <span>
                          {language === 'ar' ? 'دفع آمن ومشفر' : 'Secure & Encrypted Payment'}
                        </span>
                      </div>
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