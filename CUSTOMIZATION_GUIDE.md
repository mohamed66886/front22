# دليل التخصيص - مكون من نحن

## تخصيص الألوان 🎨

### تغيير لون الدوائر:
في `AboutUs.tsx`، ابحث عن:
```tsx
border-red-500  // حدود الدوائر
text-red-500    // عنوان الدائرة
text-teal-700   // لون الأيقونة
```

استبدلها بـ:
```tsx
border-blue-600
text-blue-600
text-blue-800
```

### تغيير لون الخلفية الفيديو:
```tsx
bg-blue-300 opacity-20  // حالي
bg-purple-300 opacity-30  // بنفسجي
bg-green-300 opacity-25  // أخضر
```

## تخصيص الأحجام 📏

### حجم الدوائر:
```tsx
// حالي
w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24

// أكبر
w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28

// أصغر
w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20
```

### حجم الأيقونات:
```tsx
// حالي
w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12

// أكبر
w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14
```

## تخصيص المسافات 📐

### المسافة بين الدوائر:
```tsx
// حالي
gap-3 sm:gap-4 md:gap-6

// أوسع
gap-4 sm:gap-6 md:gap-8

// أضيق
gap-2 sm:gap-3 md:gap-4
```

### حجم البطاقة:
```tsx
// حالي
w-full md:w-2/5 lg:w-1/3

// أعرض
w-full md:w-1/2 lg:w-2/5

// أضيق
w-full md:w-1/3 lg:w-1/4
```

## إضافة دائرة رابعة 🔵

```tsx
{/* Fourth Circle */}
<div className="flex flex-col items-center">
  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-2 md:border-3 border-red-500 flex items-center justify-center mb-2 md:mb-3 bg-white hover:scale-110 hover:shadow-lg transition-all duration-300 cursor-pointer">
    <Building className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-teal-700" />
  </div>
  <h3 className="text-xs sm:text-sm md:text-base font-semibold text-red-500 text-center leading-tight">
    {t("about.services.admin")}
  </h3>
</div>
```

ولا تنسى إضافة في ملف الترجمة:
```json
"services": {
  "admin": "إدارة"
}
```

## تخصيص التأثيرات ✨

### تأثير Hover:
```tsx
// بسيط
hover:scale-105

// متوسط (حالي)
hover:scale-110

// قوي
hover:scale-115
```

### الظل عند Hover:
```tsx
// خفيف
hover:shadow-md

// متوسط (حالي)
hover:shadow-lg

// قوي
hover:shadow-2xl
```

### سرعة الانتقال:
```tsx
// بطيء
transition-all duration-500

// عادي (حالي)
transition-all duration-300

// سريع
transition-all duration-150
```

## تخصيص الفيديو 🎬

### تغيير الفيديو:
```tsx
<source src="/your-video.mp4" type="video/mp4" />
```

### إضافة صورة بديلة:
```tsx
<video
  autoPlay
  loop
  muted
  playsInline
  poster="/fallback-image.jpg"
  className="..."
>
```

### تعطيل الفيديو واستخدام صورة:
```tsx
<div className="absolute top-0 left-0 w-full h-full">
  <Image
    src="/background.jpg"
    alt="Background"
    fill
    className="object-cover"
  />
</div>
```

## تخصيص النصوص 📝

### إضافة نص إضافي:
```tsx
<div className="text-center mt-4">
  <p className="text-sm text-gray-500">
    {t("about.services.additionalInfo")}
  </p>
</div>
```

### تغيير خط العنوان:
```tsx
// حالي
text-lg sm:text-xl md:text-2xl

// أكبر
text-xl sm:text-2xl md:text-3xl

// أصغر
text-base sm:text-lg md:text-xl
```

## أمثلة متقدمة 🚀

### إضافة أنيميشن عند التحميل:
```tsx
// في أول السطر
import { motion } from "framer-motion";

// استبدل div بـ motion.div
<motion.div 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="flex flex-col items-center"
>
```

### إضافة روابط للدوائر:
```tsx
<Link href="/students" className="flex flex-col items-center">
  <div className="w-16 h-16...">
    {/* المحتوى */}
  </div>
</Link>
```

### إضافة عداد أو بادج:
```tsx
<div className="relative">
  <div className="w-16 h-16...">
    {/* المحتوى */}
  </div>
  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
    99+
  </span>
</div>
```

## نصائح التحسين ⚡

1. **استخدم lazy loading للصور الكبيرة**
2. **ضغط الفيديو لتحسين الأداء**
3. **استخدم WebP للصور**
4. **اختبر على أجهزة حقيقية**
5. **استخدم أدوات المطور للتحقق من الاستجابة**

## أدوات مفيدة 🛠️

- **Tailwind CSS IntelliSense**: للـ autocomplete
- **Responsive Design Mode**: في المتصفح (F12)
- **Lighthouse**: لتحليل الأداء
- **React DevTools**: للتحقق من الـ props

---

للمزيد من المساعدة، راجع:
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)
