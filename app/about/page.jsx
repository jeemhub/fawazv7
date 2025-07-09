'use client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AboutPage() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center py-16 px-4">
        <div className="max-w-2xl w-full text-center">
          <div className="flex justify-center mb-8">
            <div className="relative w-32 h-32 md:w-40 md:h-40">
              <Image
                src="/logo.jpg"
                alt="Fawaz Office Logo"
                fill
                className="object-contain rounded-2xl shadow-lg border-4 border-fawaz-orange-500 bg-white"
                priority
              />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold mb-4 text-fawaz-orange-500">
            {isAr ? 'عن مكتب فواز' : 'About Fawaz Office'}
          </h1>
          <p className="text-lg text-gray-700 mb-4 leading-relaxed">
            {isAr
              ? 'مكتب فواز هو شريكك الموثوق في حلول الأمان والتكنولوجيا، نوفر أنظمة مراقبة عالية الجودة، أجهزة إنترنت متطورة، وأنظمة طاقة شمسية حديثة للمنازل والشركات.'
              : 'Fawaz Office is your trusted partner in security and technology solutions. We provide high-quality surveillance systems, advanced internet devices, and modern solar power systems for homes and businesses.'}
          </p>
          <p className="text-gray-600 mb-4 leading-relaxed">
            {isAr
              ? 'نلتزم بتقديم أفضل المنتجات والخدمات لعملائنا مع ضمان الجودة والدعم الفني المستمر. رؤيتنا هي أن نكون الخيار الأول في العراق في مجال تقنيات الأمان والطاقة والاتصالات.'
              : 'We are committed to providing the best products and services to our customers with guaranteed quality and continuous technical support. Our vision is to be the first choice in Iraq for security, energy, and communication technologies.'}
          </p>
          <div className="mt-8">
            <span className="inline-block bg-fawaz-green-100 text-fawaz-green-700 px-4 py-2 rounded-full font-semibold text-base shadow">
              {isAr ? 'خبرة، جودة، التزام' : 'Experience, Quality, Commitment'}
            </span>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
