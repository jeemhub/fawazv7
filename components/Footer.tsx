'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Instagram, 
  Phone, 
  Mail, 
  MapPin,
  Globe,
  Shield,
  Zap,
  Wifi
} from 'lucide-react';

export default function Footer() {
  const { t, isRTL, language } = useLanguage();

  const quickLinks = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.products'), href: '/products' },
    { name: t('nav.categories'), href: '/categories' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.contact'), href: '/contact' },
  ];

  const categories = [
    { name: t('category.cameras'), href: '/categories/cameras', icon: Shield },
    { name: t('category.solar'), href: '/categories/solar', icon: Zap },
    { name: t('category.doors'), href: '/categories/doors', icon: Shield },
    { name: t('category.internet'), href: '/categories/internet', icon: Wifi },
  ];

  const socialLinks = [
    {
      name: 'Instagram',
      href: 'https://instagram.com/fawazoffice',
      icon: Instagram,
      color: 'hover:text-pink-500'
    },
    {
      name: 'TikTok',
      href: 'https://tiktok.com/@fawazoffice',
      icon: Globe,
      color: 'hover:text-black'
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative w-12 h-12">
                <Image
                  src="/logo.jpg"
                  alt="Fawaz Office Logo"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
              <div className={`flex flex-col ${isRTL ? 'text-right' : 'text-left'}`}>
                <span className="font-bold text-xl gradient-text">
                  {language === 'ar' ? 'مكتب فواز' : 'Fawaz Office'}
                </span>
                <span className="text-sm text-gray-400">
                  {language === 'ar' ? 'تقنيات المعلومات' : 'IT Solutions'}
                </span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('about.description')}
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Button
                    key={social.name}
                    variant="ghost"
                    size="icon"
                    asChild
                    className={`text-gray-400 ${social.color} transition-colors`}
                  >
                    <a href={social.href} target="_blank" rel="noopener noreferrer">
                      <Icon className="h-5 w-5" />
                      <span className="sr-only">{social.name}</span>
                    </a>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-fawaz-orange-500">
              {language === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-fawaz-green-500 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-fawaz-green-500">
              {t('nav.categories')}
            </h3>
            <ul className="space-y-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <li key={category.href}>
                    <Link
                      href={category.href}
                      className="flex items-center space-x-2 text-gray-400 hover:text-fawaz-orange-500 transition-colors text-sm"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{category.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-fawaz-orange-500">
              {t('contact.title')}
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 text-sm">
                <MapPin className="h-4 w-4 text-fawaz-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">
                  {language === 'ar' 
                    ? 
                      "العشار ساحة ام البروم مول اللامي"
                    : 
                    'Al-Ashar – Um al-Broum Square – Al-Lami Mall'
                  }
                </span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="h-4 w-4 text-fawaz-green-500" />
                <span className="text-gray-400">07870706555 - 07729209282</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="h-4 w-4 text-fawaz-green-500" />
                <span className="text-gray-400">info@fawazoffice.com</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-gray-800" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 text-sm">
            © 2024 {language === 'ar' ? 'مكتب فواز' : 'Fawaz Office'}. 
            {language === 'ar' ? ' جميع الحقوق محفوظة.' : ' All rights reserved.'}
          </p>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-fawaz-green-500 transition-colors">
              {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-fawaz-green-500 transition-colors">
              {language === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}