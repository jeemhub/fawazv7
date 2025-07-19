'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Instagram, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ContactPage() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center py-16 px-4">
        <div className="max-w-xl w-full text-center">
          <h1 className="text-4xl font-extrabold mb-6 text-fawaz-orange-500">
            {isAr ? 'تواصل معنا' : 'Contact Us'}
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            {isAr ? 'يسعدنا تواصلك معنا لأي استفسار أو طلب خدمة.' : 'We are happy to hear from you for any inquiry or service request.'}
          </p>
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Phone className="text-fawaz-green-600 w-6 h-6" />
              <span className="text-lg">07809876543</span>
              <span className="text-lg">|</span>
              <Phone className="text-fawaz-green-600 w-6 h-6" />
              <span className="text-lg">07701234567</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Mail className="text-fawaz-green-600 w-6 h-6" />
              <span className="text-lg">info@fawazoffice.com</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <MapPin className="text-fawaz-green-600 w-6 h-6" />
              <span className="text-lg">{isAr ? 'البصرة، العراق' : 'Basra, Iraq'}</span>
            </div>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <a href="https://instagram.com/fawazoffice" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-pink-500 transition-colors">
                <Instagram className="w-6 h-6" />
                <span className="text-lg">@fawazoffice</span>
              </a>
              <a href="https://tiktok.com/@fawazoffice" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-black transition-colors">
                <Globe className="w-6 h-6" />
                <span className="text-lg">TikTok</span>
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 