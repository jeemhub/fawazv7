import './globals.css';
import type { Metadata } from 'next';
import { Inter, Tajawal } from 'next/font/google';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { CartProvider } from '@/contexts/CartContext';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const tajawal = Tajawal({ 
  subsets: ['arabic'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-tajawal',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Fawaz Office - مكتب فواز',
  description: 'Your trusted partner for surveillance systems, internet devices, and computer accessories - شريكك الموثوق لأنظمة المراقبة وأجهزة الإنترنت وملحقات الكمبيوتر',
  keywords: 'surveillance, cameras, internet devices, computer accessories, مراقبة, كاميرات, أجهزة إنترنت',
  authors: [{ name: 'Fawaz Office' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Fawaz Office - مكتب فواز',
    description: 'Your trusted partner for surveillance systems, internet devices, and computer accessories',
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'ar_SA',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${tajawal.variable} antialiased`}>
        <LanguageProvider>
          <CartProvider>
            {children}
            <Toaster position="top-right" />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}