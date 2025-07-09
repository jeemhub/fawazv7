'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  image: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('id', { ascending: true });
      if (error) {
        alert('حدث خطأ أثناء جلب الفئات');
        return;
      }
      if (data) setCategories(data);
    };
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-10 text-fawaz-orange-500 text-center">جميع الفئات</h1>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.id}`} className="group block rounded-xl overflow-hidden shadow-lg border hover:shadow-2xl transition-all bg-white">
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={category.image && category.image.trim() !== '' ? category.image : '/default.png'}
                  alt={category.nameAr || category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2 text-fawaz-green-700 group-hover:text-fawaz-orange-500 transition-colors">
                  {category.nameAr || category.name}
                </h2>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {category.descriptionAr || category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
} 