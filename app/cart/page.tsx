'use client';

import React, { useState } from 'react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Select } from '@/components/ui/select';

export default function CartPage() {
  const { t, language, isRTL } = useLanguage();
  const { items, updateQuantity, removeFromCart, getTotalPrice, getTotalItems, clearCart } = useCart();
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [shipping, setShipping] = useState(5000);
  const [shippingLabel, setShippingLabel] = useState('محافظات');

  const handleCheckout = () => {
    setShowCheckoutForm(true);
  };

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    let invoiceText = `فاتورة طلب جديد:\n`;
    invoiceText += `الاسم: ${customerName}\n`;
    invoiceText += `رقم الهاتف: ${customerPhone}\n`;
    invoiceText += `العنوان: ${customerAddress}\n`;
    invoiceText += `----------------------\n`;
    items.forEach((item, idx) => {
      invoiceText += `${idx + 1}- ${item.nameAr || item.name} × ${item.quantity} = ${(item.price * item.quantity).toLocaleString()} د.ع\n`;
    });
    invoiceText += `----------------------\n`;
    invoiceText += `المجموع: ${getTotalPrice().toLocaleString()} د.ع\n`;
    invoiceText += `الشحن (${shippingLabel}): ${shipping.toLocaleString()} د.ع\n`;
    invoiceText += `الضريبة: 0 د.ع\n`;
    invoiceText += `الإجمالي: ${(getTotalPrice() + shipping).toLocaleString()} د.ع\n`;
    const waText = encodeURIComponent(invoiceText);
    window.open(`https://wa.me/9647870706555?text=${waText}`, '_blank');
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} د.ع`;
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        
        <section className="py-8 md:py-12 lg:py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-fawaz-orange-100 to-fawaz-green-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 lg:mb-8 shadow-lg">
                <ShoppingCart className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 text-fawaz-orange-500" />
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4 lg:mb-6 gradient-text">
                {t('cart.empty')}
              </h1>
              <p className="text-sm md:text-base lg:text-lg text-gray-600 mb-6 md:mb-8 lg:mb-10 leading-relaxed px-4">
                {language === 'ar' 
                  ? 'ابدأ رحلة التسوق الرائعة معنا واكتشف منتجاتنا المميزة'
                  : 'Start your amazing shopping journey with us and discover our amazing products'
                }
              </p>
              <Link href="/products">
                <Button className="btn-primary text-sm md:text-base lg:text-lg px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4">
                  <ShoppingBag className={`w-4 h-4 md:w-5 md:h-5 ${isRTL ? 'ml-2 md:ml-3' : 'mr-2 md:mr-3'}`} />
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-4 md:py-6 lg:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 md:gap-4 lg:gap-6"
          >
            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-2 md:mb-3 lg:mb-4 gradient-text">
                {t('cart.title')}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 md:gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 md:w-5 md:h-5 text-fawaz-orange-500 flex-shrink-0" />
                  <span className="font-medium text-sm md:text-base">
                    {getTotalItems()} {language === 'ar' ? 'عنصر في السلة' : 'items in your cart'}
                  </span>
                </div>
                <div className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full flex-shrink-0"></div>
                <span className="text-fawaz-green-600 font-semibold text-sm md:text-base">
                  {formatPrice(getTotalPrice())}
                </span>
              </div>
            </div>
            <Link href="/products" className="flex-shrink-0">
              <Button variant="outline" className="border-fawaz-green-500 text-fawaz-green-600 hover:bg-fawaz-green-50 px-3 md:px-4 lg:px-6 py-2 md:py-3 text-sm md:text-base w-full sm:w-auto whitespace-nowrap">
                <ArrowLeft className={`w-4 h-4 md:w-5 md:h-5 ${isRTL ? 'ml-2 md:ml-3' : 'mr-2 md:mr-3'} flex-shrink-0`} />
                {language === 'ar' ? 'متابعة التسوق' : 'Continue Shopping'}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-4 md:py-6 lg:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 xl:gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3 md:space-y-4 lg:space-y-6">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group"
                >
                  <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                    <CardContent className="p-3 md:p-4 lg:p-6 xl:p-8">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 lg:gap-6">
                        {/* Product Image */}
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex-shrink-0 mx-auto sm:mx-0 rounded-xl overflow-hidden">
                          <Image
                            src={item.image && item.image.trim() !== '' ? item.image : '/default.png'}
                            alt={language === 'ar' ? item.nameAr : item.name}
                            fill
                            className="object-cover rounded-xl shadow-md"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-xl"></div>
                        </div>

                        {/* Product Info & Controls */}
                        <div className="flex-1 w-full flex flex-col gap-2 md:gap-3">
                          <h3 className="font-bold text-sm md:text-base lg:text-lg xl:text-xl text-gray-900 truncate text-center sm:text-right">
                            {language === 'ar' ? item.nameAr : item.name}
                          </h3>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 justify-between">
                            <span className="text-base md:text-lg lg:text-xl font-bold text-fawaz-green-600 text-center sm:text-right">
                              {formatPrice(item.price)}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 md:gap-4 mt-2">
                            {/* Quantity Controls */}
                            <div className="flex items-center justify-center bg-gray-50 rounded-lg p-1 w-full sm:w-auto">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="h-8 w-8 md:h-10 md:w-10 hover:bg-white hover:shadow-sm"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3 md:h-4 md:w-4" />
                              </Button>
                              <span className="w-8 md:w-12 text-center font-bold text-sm md:text-lg">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-8 w-8 md:h-10 md:w-10 hover:bg-white hover:shadow-sm"
                              >
                                <Plus className="h-3 w-3 md:h-4 md:w-4" />
                              </Button>
                            </div>
                            {/* Remove Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 md:px-4 py-2 rounded-lg transition-colors w-full sm:w-auto mt-2 sm:mt-0 text-xs md:text-sm"
                            >
                              <Trash2 className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                              {t('cart.remove')}
                            </Button>
                          </div>
                          {/* Item Total */}
                          <p className="font-bold text-base md:text-lg lg:text-xl text-fawaz-green-700 text-center sm:text-right mt-2">
                            {formatPrice(item.price * item.quantity)}
                          </p>
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
                className="text-center pt-3 md:pt-4 lg:pt-6"
              >
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300 px-4 md:px-6 lg:px-8 py-2 md:py-3 rounded-lg transition-all duration-300 mt-2 text-sm md:text-base"
                >
                  <Trash2 className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3" />
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
                className="sticky top-20 lg:top-24"
              >
                <Card className="border-0 shadow-xl rounded-2xl bg-white">
                  <CardHeader className="bg-gradient-to-r from-fawaz-orange-50 to-fawaz-green-50 pb-3 md:pb-4 lg:pb-6 rounded-t-2xl">
                    <CardTitle className="gradient-text text-lg md:text-xl lg:text-2xl flex items-center gap-2 md:gap-3">
                      <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                      {language === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 md:p-4 lg:p-6 space-y-3 md:space-y-4 lg:space-y-6">
                    {/* Items Summary */}
                    <div className="space-y-2 md:space-y-3 max-h-48 md:max-h-64 overflow-y-auto">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-xs md:text-sm p-2 md:p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {language === 'ar' ? item.nameAr : item.name}
                            </p>
                            <p className="text-gray-500 text-xs">{`× ${item.quantity}`}</p>
                          </div>
                          <span className="font-bold text-fawaz-green-600 ml-2 md:ml-3 text-xs md:text-sm">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-3 md:my-4 lg:my-6" />

                    {/* Shipping Select */}
                    <div className="mb-3 md:mb-4">
                      <label className="block mb-1 md:mb-2 font-medium text-gray-700 text-sm md:text-base">
                        {language === 'ar' ? 'الشحن' : 'Shipping'}
                      </label>
                      <select
                        className="w-full border rounded px-2 md:px-3 py-2 md:py-3 focus:outline-none focus:ring-2 focus:ring-fawaz-orange-500 text-sm md:text-base"
                        value={shipping}
                        onChange={e => {
                          const val = Number(e.target.value);
                          setShipping(val);
                          setShippingLabel(val === 3000 ? 'البصرة' : 'محافظات');
                        }}
                      >
                        <option value={5000}>{language === 'ar' ? 'محافظات 5000' : 'Other Provinces 5000'}</option>
                        <option value={3000}>{language === 'ar' ? 'البصرة 3000' : 'Basra 3000'}</option>
                      </select>
                    </div>

                    {/* Totals */}
                    <div className="space-y-2 md:space-y-3 lg:space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm md:text-base">{language === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                        <span className="font-semibold text-base md:text-lg lg:text-xl">{formatPrice(getTotalPrice())}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm md:text-base">{language === 'ar' ? 'الشحن' : 'Shipping'}</span>
                        <span className="font-semibold text-base md:text-lg lg:text-xl">{formatPrice(shipping)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm md:text-base">{language === 'ar' ? 'الضريبة' : 'Tax'}</span>
                        <span className="font-semibold text-sm md:text-base">{formatPrice(0)}</span>
                      </div>
                    </div>

                    <Separator className="my-3 md:my-4 lg:my-6" />

                    {/* Grand Total */}
                    <div className="flex justify-between items-center text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-fawaz-orange-50 to-fawaz-green-50 p-3 md:p-4 rounded-lg">
                      <span className="gradient-text">{t('cart.total')}</span>
                      <span className="text-xl md:text-2xl lg:text-3xl text-fawaz-green-600">
                        {formatPrice(getTotalPrice() + shipping)}
                      </span>
                    </div>

                    {/* Checkout Button */}
                    <Button className="w-full btn-primary text-sm md:text-base lg:text-lg py-3 md:py-4 lg:py-6 rounded-xl shadow-lg hover:shadow-xl mt-3 md:mt-4" onClick={handleCheckout}>
                      <CreditCard className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3" />
                      {t('cart.checkout')}
                    </Button>
                    <Dialog open={showCheckoutForm} onOpenChange={setShowCheckoutForm}>
                      <DialogContent className="max-w-md mx-auto">
                        <DialogHeader>
                          <DialogTitle className="text-lg md:text-xl">معلومات الزبون لإتمام الطلب</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSendWhatsApp} className="space-y-3 md:space-y-4 mt-2">
                          <div>
                            <label className="block mb-1 font-medium text-sm md:text-base">الاسم الكامل</label>
                            <input type="text" required value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full border rounded px-3 py-2 md:py-3 text-sm md:text-base" />
                          </div>
                          <div>
                            <label className="block mb-1 font-medium text-sm md:text-base">رقم الهاتف</label>
                            <input type="tel" required value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="w-full border rounded px-3 py-2 md:py-3 text-sm md:text-base" />
                          </div>
                          <div>
                            <label className="block mb-1 font-medium text-sm md:text-base">العنوان</label>
                            <input type="text" required value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} className="w-full border rounded px-3 py-2 md:py-3 text-sm md:text-base" />
                          </div>
                          <Button type="submit" className="w-full btn-primary text-sm md:text-base lg:text-lg py-3 md:py-4 mt-2">إرسال الفاتورة إلى واتساب</Button>
                        </form>
                        <DialogClose asChild>
                          <button className="absolute top-2 left-2 text-gray-400 hover:text-gray-700 text-sm md:text-base">إغلاق</button>
                        </DialogClose>
                      </DialogContent>
                    </Dialog>

                    {/* Security Badge */}
                    <div className="text-center text-xs md:text-sm text-gray-500 mt-4 md:mt-6 p-3 md:p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center gap-1 md:gap-2 mb-1 md:mb-2">
                        <Shield className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
                        <span className="font-medium text-xs md:text-sm">
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