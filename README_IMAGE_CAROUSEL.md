# Fawaz Office E-commerce - Image Carousel System

## نظرة عامة (Overview)

تم تطوير نظام عرض الصور المتعددة للمنتجات مع دعم كامل للشاشات المختلفة والتفاعل باللمس للأجهزة المحمولة.

A multi-image display system for products has been developed with full support for different screen sizes and touch interaction for mobile devices.

## الميزات الرئيسية (Key Features)

### 🖼️ نظام الصور المتعددة (Multi-Image System)
- عرض صور متعددة للمنتج مع تمرير سلس
- معرض مصغر للصور (Thumbnail Gallery)
- دعم العرض بالملء الشاشة (Fullscreen Mode)
- تمرير تلقائي مع إمكانية إيقافه

### 📱 تصميم متجاوب (Responsive Design)
- يعمل على جميع أحجام الشاشات
- دعم كامل للأجهزة المحمولة
- تفاعل باللمس والتمرير (Touch & Swipe)
- تخطيط متكيف مع الشاشات الصغيرة والكبيرة

### 🎯 تفاعل المستخدم (User Experience)
- أزرار التنقل (السابق/التالي)
- مؤشرات النقاط للتنقل السريع
- عداد الصور
- دعم لوحة المفاتيح (أسهم + Escape)

## المكونات (Components)

### 1. ImageCarousel
المكون الرئيسي لعرض الصور مع جميع الميزات التفاعلية.

```tsx
import ImageCarousel from "@/components/ImageCarousel";

<ImageCarousel
  images={product.images}
  alt={product.name}
  className="w-full h-full"
  showFullscreen={true}
/>
```

**الخصائص (Props):**
- `images`: مصفوفة روابط الصور
- `alt`: النص البديل للصور
- `className`: فئات CSS إضافية
- `showFullscreen`: إظهار زر الملء الشاشة

### 2. ThumbnailGallery
معرض مصغر للصور للتنقل السريع.

```tsx
import ThumbnailGallery from "@/components/ThumbnailGallery";

<ThumbnailGallery
  images={product.images}
  currentIndex={currentIndex}
  onThumbnailClick={handleThumbnailClick}
  className="mt-4"
/>
```

## قاعدة البيانات (Database Structure)

### جدول المنتجات (Products Table)
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  name_ar TEXT,
  description TEXT,
  description_ar TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  image_url TEXT, -- الصورة الرئيسية
  additional_images TEXT[], -- مصفوفة الصور الإضافية
  in_stock BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### جدول صور المنتجات (Product Images Table)
```sql
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## التثبيت والإعداد (Installation & Setup)

### 1. تشغيل سكريبت قاعدة البيانات
```bash
# في Supabase SQL Editor
# انسخ والصق محتوى database_setup.sql
```

### 2. إضافة الصور للمنتجات
```sql
-- إضافة صور لمنتج موجود
UPDATE products 
SET additional_images = ARRAY[
  'https://example.com/image1.jpg',
  'https://example.com/image2.jpg',
  'https://example.com/image3.jpg'
]
WHERE id = 'product-uuid-here';

-- أو استخدام جدول الصور المنفصل
INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
  ('product-uuid-here', 'https://example.com/image1.jpg', 'Front View', 1, true),
  ('product-uuid-here', 'https://example.com/image2.jpg', 'Side View', 2, false),
  ('product-uuid-here', 'https://example.com/image3.jpg', 'Back View', 3, false);
```

## الاستخدام في الكود (Usage in Code)

### صفحة تفاصيل المنتج
```tsx
// في app/products/[id]/page.tsx
const [product, setProduct] = useState<Product | null>(null);

useEffect(() => {
  const fetchProduct = async () => {
    const { data } = await supabase
      .from("products")
      .select(`
        *,
        category:categories(name, name_ar)
      `)
      .eq("id", id)
      .single();

    if (data) {
      // معالجة الصور
      const allImages = [];
      if (data.image_url) allImages.push(data.image_url);
      if (data.additional_images) allImages.push(...data.additional_images);
      if (allImages.length === 0) allImages.push("/default.png");

      setProduct({
        ...data,
        additional_images: allImages,
      });
    }
  };

  fetchProduct();
}, [id]);
```

### عرض الصور
```tsx
{product && (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
    {/* قسم الصور */}
    <div className="p-6 md:p-8 bg-gray-50">
      <div className="relative h-80 md:h-96 lg:h-[500px]">
        <ImageCarousel
          images={product.additional_images}
          alt={productName}
          className="w-full h-full"
        />
      </div>
      
      {/* معرض الصور المصغرة */}
      <ThumbnailGallery
        images={product.additional_images}
        currentIndex={currentImageIndex}
        onThumbnailClick={handleThumbnailClick}
        className="mt-4"
      />
    </div>
    
    {/* تفاصيل المنتج */}
    <div className="p-6 md:p-8">
      {/* ... محتوى تفاصيل المنتج ... */}
    </div>
  </div>
)}
```

## التخصيص (Customization)

### تغيير ألوان التصميم
```css
/* في globals.css */
:root {
  --carousel-primary: #10b981; /* Fawaz Green */
  --carousel-secondary: #f59e0b; /* Fawaz Orange */
  --carousel-overlay: rgba(0, 0, 0, 0.5);
}

/* تخصيص أزرار التنقل */
.carousel-nav-button {
  background-color: var(--carousel-overlay);
  color: white;
  transition: all 0.2s ease;
}

.carousel-nav-button:hover {
  background-color: var(--carousel-primary);
}
```

### تعديل سلوك التمرير التلقائي
```tsx
// في ImageCarousel.tsx
useEffect(() => {
  if (images.length <= 1) return;
  
  const interval = setInterval(() => {
    nextImage();
  }, 5000); // تغيير الفاصل الزمني هنا

  return () => clearInterval(interval);
}, [images.length, nextImage]);
```

## دعم الأجهزة المحمولة (Mobile Support)

### تفاعل اللمس
- تمرير لليسار: الصورة التالية
- تمرير لليمين: الصورة السابقة
- مسافة التمرير الأدنى: 50 بكسل

### التخطيط المتجاوب
```css
/* تخطيط للشاشات الصغيرة */
@media (max-width: 768px) {
  .carousel-container {
    height: 300px;
  }
  
  .thumbnail-gallery {
    gap: 8px;
  }
  
  .thumbnail-item {
    width: 60px;
    height: 60px;
  }
}

/* تخطيط للشاشات المتوسطة */
@media (min-width: 769px) and (max-width: 1024px) {
  .carousel-container {
    height: 400px;
  }
}

/* تخطيط للشاشات الكبيرة */
@media (min-width: 1025px) {
  .carousel-container {
    height: 500px;
  }
}
```

## استكشاف الأخطاء (Troubleshooting)

### مشاكل شائعة (Common Issues)

#### 1. الصور لا تظهر
```tsx
// تأكد من صحة روابط الصور
console.log('Product images:', product.additional_images);

// استخدم الصورة الافتراضية
const fallbackImage = "/default.png";
```

#### 2. التمرير لا يعمل على الأجهزة المحمولة
```tsx
// تأكد من تفعيل أحداث اللمس
<div 
  onTouchStart={onTouchStart}
  onTouchMove={onTouchMove}
  onTouchEnd={onTouchEnd}
>
  {/* محتوى الكاروسيل */}
</div>
```

#### 3. مشاكل الأداء مع الصور الكبيرة
```tsx
// استخدم تحسين الصور
import { getOptimizedImageUrl } from "@/lib/imageUtils";

const optimizedUrl = getOptimizedImageUrl(imageUrl, 800, 600);
```

## أفضل الممارسات (Best Practices)

### 1. تحسين الصور
- استخدم تنسيقات حديثة (WebP, AVIF)
- اضبط أحجام الصور حسب الشاشة
- استخدم الصور المضغوطة

### 2. تجربة المستخدم
- أضف صور تحميل (Loading states)
- استخدم الصور الافتراضية
- تأكد من سرعة التحميل

### 3. إمكانية الوصول
- أضف نصوص بديلة مناسبة
- دعم التنقل بلوحة المفاتيح
- تأكد من التباين الجيد

## الدعم والمساهمة (Support & Contribution)

للمساعدة أو الإبلاغ عن مشاكل:
1. تحقق من هذا المستند أولاً
2. راجع الكود المصدري
3. أنشئ تقرير مشكلة مع تفاصيل كاملة

For help or to report issues:
1. Check this document first
2. Review the source code
3. Create an issue report with full details

---

**تم التطوير بواسطة فريق Fawaz Office**
**Developed by Fawaz Office Team**
