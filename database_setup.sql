-- =====================================================
-- Fawaz Office E-commerce Database Setup
-- =====================================================

-- 1. تفعيل امتداد الـ UUID لوضع مفاتيح أساسية عشوائية
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. جدول التصنيفات (categories)
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE, -- قيد فريد
  name_ar TEXT, -- الاسم بالعربية
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. جدول المنتجات (products)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL UNIQUE, -- قيد فريد
  name_ar TEXT, -- الاسم بالعربية
  description TEXT,
  description_ar TEXT, -- الوصف بالعربية
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  image_url TEXT, -- الصورة الرئيسية
  additional_images TEXT[], -- مصفوفة الصور الإضافية
  in_stock BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. جدول صور المنتجات (product_images) - للصور المتعددة
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT, -- نص بديل للصورة
  sort_order INTEGER DEFAULT 0, -- ترتيب الصور
  is_primary BOOLEAN DEFAULT false, -- هل هي الصورة الرئيسية
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. جدول الإعلانات (ads)
CREATE TABLE IF NOT EXISTS public.ads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL UNIQUE, -- قيد فريد
  description TEXT,
  image_url TEXT,
  link TEXT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. إنشاء فهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON public.products(in_stock);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_sort_order ON public.product_images(sort_order);

-- 7. تفعيل RLS (ضروري في Supabase)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;

-- 8. حذف السياسات القديمة (إن وجدت)
DROP POLICY IF EXISTS "Authenticated can select categories" ON public.categories;
DROP POLICY IF EXISTS "Authenticated can insert categories" ON public.categories;
DROP POLICY IF EXISTS "Authenticated can update categories" ON public.categories;
DROP POLICY IF EXISTS "Authenticated can delete categories" ON public.categories;

DROP POLICY IF EXISTS "Authenticated can select products" ON public.products;
DROP POLICY IF EXISTS "Authenticated can insert products" ON public.products;
DROP POLICY IF EXISTS "Authenticated can update products" ON public.products;
DROP POLICY IF EXISTS "Authenticated can delete products" ON public.products;

DROP POLICY IF EXISTS "Authenticated can select product_images" ON public.product_images;
DROP POLICY IF EXISTS "Authenticated can insert product_images" ON public.product_images;
DROP POLICY IF EXISTS "Authenticated can update product_images" ON public.product_images;
DROP POLICY IF EXISTS "Authenticated can delete product_images" ON public.product_images;

DROP POLICY IF EXISTS "Authenticated can select ads" ON public.ads;
DROP POLICY IF EXISTS "Authenticated can insert ads" ON public.ads;
DROP POLICY IF EXISTS "Authenticated can update ads" ON public.ads;
DROP POLICY IF EXISTS "Authenticated can delete ads" ON public.ads;

DROP POLICY IF EXISTS "Public select categories" ON public.categories;
DROP POLICY IF EXISTS "Public insert categories" ON public.categories;
DROP POLICY IF EXISTS "Public update categories" ON public.categories;
DROP POLICY IF EXISTS "Public delete categories" ON public.categories;

DROP POLICY IF EXISTS "Public select products" ON public.products;
DROP POLICY IF EXISTS "Public insert products" ON public.products;
DROP POLICY IF EXISTS "Public update products" ON public.products;
DROP POLICY IF EXISTS "Public delete products" ON public.products;

DROP POLICY IF EXISTS "Public select product_images" ON public.product_images;
DROP POLICY IF EXISTS "Public insert product_images" ON public.product_images;
DROP POLICY IF EXISTS "Public update product_images" ON public.product_images;
DROP POLICY IF EXISTS "Public delete product_images" ON public.product_images;

DROP POLICY IF EXISTS "Public select ads" ON public.ads;
DROP POLICY IF EXISTS "Public insert ads" ON public.ads;
DROP POLICY IF EXISTS "Public update ads" ON public.ads;
DROP POLICY IF EXISTS "Public delete ads" ON public.ads;

-- 9. سياسات عامة (بدون أي قيود)
-- التصنيفات
CREATE POLICY "Public select categories" ON public.categories
  FOR SELECT USING (true);
CREATE POLICY "Public insert categories" ON public.categories
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update categories" ON public.categories
  FOR UPDATE USING (true);
CREATE POLICY "Public delete categories" ON public.categories
  FOR DELETE USING (true);

-- المنتجات
CREATE POLICY "Public select products" ON public.products
  FOR SELECT USING (true);
CREATE POLICY "Public insert products" ON public.products
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update products" ON public.products
  FOR UPDATE USING (true);
CREATE POLICY "Public delete products" ON public.products
  FOR DELETE USING (true);

-- صور المنتجات
CREATE POLICY "Public select product_images" ON public.product_images
  FOR SELECT USING (true);
CREATE POLICY "Public insert product_images" ON public.product_images
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update product_images" ON public.product_images
  FOR UPDATE USING (true);
CREATE POLICY "Public delete product_images" ON public.product_images
  FOR DELETE USING (true);

-- الإعلانات
CREATE POLICY "Public select ads" ON public.ads
  FOR SELECT USING (true);
CREATE POLICY "Public insert ads" ON public.ads
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update ads" ON public.ads
  FOR UPDATE USING (true);
CREATE POLICY "Public delete ads" ON public.ads
  FOR DELETE USING (true);

-- 10. إدراج بيانات تجريبية
-- التصنيفات
INSERT INTO public.categories (id, name, name_ar, description, image_url) VALUES
  (uuid_generate_v4(), 'Electronics', 'إلكترونيات', 'All electronic devices and gadgets', NULL),
  (uuid_generate_v4(), 'Furniture', 'أثاث', 'Home and office furniture', NULL),
  (uuid_generate_v4(), 'Networking', 'شبكات', 'Network equipment and accessories', NULL)
ON CONFLICT (name) DO NOTHING;

-- المنتجات مع صور متعددة
INSERT INTO public.products (id, category_id, name, name_ar, description, description_ar, price, image_url, additional_images, in_stock, featured) VALUES
  (
    uuid_generate_v4(),
    (SELECT id FROM public.categories WHERE name = 'Networking'),
    'IP-COM Cloud Managed PoE Router M20-8G-POE',
    'راوتر IP-COM سحابي مع إدارة PoE M20-8G-POE',
    '9 Port Cloud Managed PoE Router with advanced features including load balancing and PoE+ support',
    'راوتر سحابي مع إدارة 9 منافذ PoE مع ميزات متقدمة تشمل موازنة التحميل ودعم PoE+',
    115000,
    'https://example.com/router-main.jpg',
    ARRAY[
      'https://example.com/router-main.jpg',
      'https://example.com/router-side.jpg',
      'https://example.com/router-back.jpg',
      'https://example.com/router-detail.jpg'
    ],
    true,
    true
  ),
  (
    uuid_generate_v4(),
    (SELECT id FROM public.categories WHERE name = 'Electronics'),
    'Smart Watch Pro',
    'ساعة ذكية برو',
    'Advanced fitness tracking smartwatch with heart rate monitor',
    'ساعة ذكية متقدمة لتتبع اللياقة مع مراقب معدل ضربات القلب',
    99.99,
    'https://example.com/watch-main.jpg',
    ARRAY[
      'https://example.com/watch-main.jpg',
      'https://example.com/watch-side.jpg',
      'https://example.com/watch-strap.jpg'
    ],
    true,
    false
  ),
  (
    uuid_generate_v4(),
    (SELECT id FROM public.categories WHERE name = 'Furniture'),
    'Ergonomic Office Chair',
    'كرسي مكتب مريح',
    'Comfortable ergonomic office chair with adjustable features',
    'كرسي مكتب مريح مع ميزات قابلة للتعديل',
    49.50,
    'https://example.com/chair-main.jpg',
    ARRAY[
      'https://example.com/chair-main.jpg',
      'https://example.com/chair-side.jpg',
      'https://example.com/chair-back.jpg'
    ],
    true,
    false
  )
ON CONFLICT (name) DO NOTHING;

-- صور المنتجات (جدول منفصل)
INSERT INTO public.product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
  -- Router images
  (
    (SELECT id FROM public.products WHERE name = 'IP-COM Cloud Managed PoE Router M20-8G-POE'),
    'https://example.com/router-main.jpg',
    'IP-COM Router Front View',
    1,
    true
  ),
  (
    (SELECT id FROM public.products WHERE name = 'IP-COM Cloud Managed PoE Router M20-8G-POE'),
    'https://example.com/router-side.jpg',
    'IP-COM Router Side View',
    2,
    false
  ),
  (
    (SELECT id FROM public.products WHERE name = 'IP-COM Cloud Managed PoE Router M20-8G-POE'),
    'https://example.com/router-back.jpg',
    'IP-COM Router Back View',
    3,
    false
  ),
  (
    (SELECT id FROM public.products WHERE name = 'IP-COM Cloud Managed PoE Router M20-8G-POE'),
    'https://example.com/router-detail.jpg',
    'IP-COM Router Detail View',
    4,
    false
  ),
  -- Smart Watch images
  (
    (SELECT id FROM public.products WHERE name = 'Smart Watch Pro'),
    'https://example.com/watch-main.jpg',
    'Smart Watch Pro Front View',
    1,
    true
  ),
  (
    (SELECT id FROM public.products WHERE name = 'Smart Watch Pro'),
    'https://example.com/watch-side.jpg',
    'Smart Watch Pro Side View',
    2,
    false
  ),
  (
    (SELECT id FROM public.products WHERE name = 'Smart Watch Pro'),
    'https://example.com/watch-strap.jpg',
    'Smart Watch Pro Strap',
    3,
    false
  ),
  -- Office Chair images
  (
    (SELECT id FROM public.products WHERE name = 'Ergonomic Office Chair'),
    'https://example.com/chair-main.jpg',
    'Ergonomic Office Chair Front View',
    1,
    true
  ),
  (
    (SELECT id FROM public.products WHERE name = 'Ergonomic Office Chair'),
    'https://example.com/chair-side.jpg',
    'Ergonomic Office Chair Side View',
    2,
    false
  ),
  (
    (SELECT id FROM public.products WHERE name = 'Ergonomic Office Chair'),
    'https://example.com/chair-back.jpg',
    'Ergonomic Office Chair Back View',
    3,
    false
  );

-- الإعلانات
INSERT INTO public.ads (title, description, image_url, link, start_date, end_date) VALUES
  ('Summer Sale', 'خصم 20% على جميع المنتجات', 'https://example.com/sale-banner.jpg', 'https://example.com/sale', '2025-07-01', '2025-07-31'),
  ('New Arrivals', 'منتجات جديدة وصلت للتو', 'https://example.com/new-arrivals.jpg', 'https://example.com/new', '2025-01-01', '2025-12-31')
ON CONFLICT (title) DO NOTHING;

-- 11. إنشاء دالة لتحديث updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 12. إنشاء triggers لتحديث updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ads_updated_at BEFORE UPDATE ON public.ads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 13. إنشاء view للمنتجات مع معلومات التصنيف
CREATE OR REPLACE VIEW products_with_categories AS
SELECT 
    p.*,
    c.name as category_name,
    c.name_ar as category_name_ar,
    c.description as category_description,
    array_agg(pi.image_url ORDER BY pi.sort_order) FILTER (WHERE pi.image_url IS NOT NULL) as all_images
FROM public.products p
LEFT JOIN public.categories c ON p.category_id = c.id
LEFT JOIN public.product_images pi ON p.id = pi.product_id
GROUP BY p.id, c.name, c.name_ar, c.description;

-- 14. إنشاء دالة للحصول على صور المنتج
CREATE OR REPLACE FUNCTION get_product_images(product_uuid UUID)
RETURNS TABLE(image_url TEXT, alt_text TEXT, sort_order INTEGER, is_primary BOOLEAN) AS $$
BEGIN
    RETURN QUERY
    SELECT pi.image_url, pi.alt_text, pi.sort_order, pi.is_primary
    FROM public.product_images pi
    WHERE pi.product_id = product_uuid
    ORDER BY pi.sort_order;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ملاحظات مهمة:
-- =====================================================
-- 1. تم إنشاء جدول منفصل للصور (product_images) للسماح بإدارة أفضل للصور
-- 2. يمكن استخدام additional_images في جدول المنتجات أو استخدام جدول الصور المنفصل
-- 3. تم إنشاء view للمنتجات مع معلومات التصنيف والصور
-- 4. تم إنشاء دالة للحصول على صور منتج معين
-- 5. جميع الجداول تدعم اللغة العربية والإنجليزية
-- 6. تم إضافة فهارس لتحسين الأداء
-- =====================================================
