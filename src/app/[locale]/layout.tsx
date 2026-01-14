import { Locale } from '@/i18n/config';
import { Noto_Kufi_Arabic } from 'next/font/google';
import '../globals.css';

const notoKufiArabic = Noto_Kufi_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-arabic',
  display: 'swap',
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const isRTL = locale === 'ar';

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'} className={locale === 'ar' ? notoKufiArabic.variable : ''}>
      <body className={`antialiased ${locale === 'ar' ? 'font-arabic' : ''}`}>
        {children}
      </body>
    </html>
  );
}
