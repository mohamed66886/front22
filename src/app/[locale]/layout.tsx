import { Noto_Kufi_Arabic } from 'next/font/google';
import '../globals.css';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ControlButtons from '@/components/ControlButtons';

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
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isRTL = locale === 'ar';

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body className={`antialiased ${locale === 'ar' ? 'font-arabic' : ''}`}>
        <ThemeProvider>
          <ControlButtons />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
