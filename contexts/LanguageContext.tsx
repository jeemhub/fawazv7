'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.categories': 'Categories',
    'nav.about': 'About Us',
    'nav.contact': 'Contact',
    'nav.cart': 'Cart',
    
    // Home Page
    'home.hero.title': 'Your Trusted Partner in Security & Technology',
    'home.hero.subtitle': 'Discover premium surveillance systems, internet devices, and computer accessories for your home and business',
    'home.hero.cta': 'Shop Now',
    'home.hero.learn': 'Learn More',
    
    // Categories
    'category.cameras': 'Security Cameras',
    'category.solar': 'Solar Power Systems',
    'category.doors': 'Smart Door Systems',
    'category.internet': 'Internet Devices',
    
    // Products
    'product.addToCart': 'Add to Cart',
    'product.viewDetails': 'View Details',
    'product.price': 'Price',
    'product.inStock': 'In Stock',
    'product.outOfStock': 'Out of Stock',
    
    // Cart
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.total': 'Total',
    'cart.checkout': 'Checkout',
    'cart.remove': 'Remove',
    'cart.quantity': 'Quantity',
    
    // Common
    'common.search': 'Search products...',
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
    'common.tryAgain': 'Try Again',
    'common.viewAll': 'View All',
    'common.readMore': 'Read More',
    
    // About
    'about.title': 'About Fawaz Office',
    'about.description': 'We are your trusted partner in security and technology solutions, providing high-quality surveillance systems, internet devices, and computer accessories.',
    
    // Contact
    'contact.title': 'Contact Us',
    'contact.address': 'Address',
    'contact.phone': 'Phone',
    'contact.email': 'Email',
    'contact.social': 'Follow Us',
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.products': 'المنتجات',
    'nav.categories': 'الفئات',
    'nav.about': 'من نحن',
    'nav.contact': 'اتصل بنا',
    'nav.cart': 'السلة',
    
    // Home Page
    'home.hero.title': 'شريكك الموثوق في الأمان والتكنولوجيا',
    'home.hero.subtitle': 'اكتشف أنظمة المراقبة المتميزة وأجهزة الإنترنت وملحقات الكمبيوتر لمنزلك وعملك',
    'home.hero.cta': 'تسوق الآن',
    'home.hero.learn': 'اعرف المزيد',
    
    // Categories
    'category.cameras': 'كاميرات المراقبة',
    'category.solar': 'أنظمة الطاقة الشمسية',
    'category.doors': 'أنظمة الأبواب الذكية',
    'category.internet': 'أجهزة الإنترنت',
    
    // Products
    'product.addToCart': 'أضف للسلة',
    'product.viewDetails': 'عرض التفاصيل',
    'product.price': 'السعر',
    'product.inStock': 'متوفر',
    'product.outOfStock': 'غير متوفر',
    
    // Cart
    'cart.title': 'سلة التسوق',
    'cart.empty': 'سلتك فارغة',
    'cart.total': 'المجموع',
    'cart.checkout': 'إتمام الشراء',
    'cart.remove': 'إزالة',
    'cart.quantity': 'الكمية',
    
    // Common
    'common.search': 'البحث عن المنتجات...',
    'common.loading': 'جاري التحميل...',
    'common.error': 'حدث خطأ ما',
    'common.tryAgain': 'حاول مرة أخرى',
    'common.viewAll': 'عرض الكل',
    'common.readMore': 'اقرأ المزيد',
    
    // About
    'about.title': 'حول مكتب فواز',
    'about.description': 'نحن شريكك الموثوق في حلول الأمان والتكنولوجيا، نوفر أنظمة مراقبة عالية الجودة وأجهزة إنترنت وملحقات كمبيوتر.',
    
    // Contact
    'contact.title': 'اتصل بنا',
    'contact.address': 'العنوان',
    'contact.phone': 'الهاتف',
    'contact.email': 'البريد الإلكتروني',
    'contact.social': 'تابعنا',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}