import type { Metadata } from 'next';
import { getTranslations } from '@/i18n/utils';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import LatestNews from '@/components/LatestNews';
import AboutUs from '@/components/AboutUs';
import FAQ from '@/components/FAQ';
import ContactUs from '@/components/ContactUs';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Our Company - شركتنا',
  description: 'A modern multilingual website',
};

export default async function LocalePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const translations = getTranslations(locale as 'ar' | 'en');
  const validLocale = locale as 'ar' | 'en';

  return (
    <>
      <Header translations={translations} locale={validLocale} />
      <Hero translations={translations} locale={validLocale} />
      <LatestNews translations={translations} locale={validLocale} />
      <AboutUs locale={validLocale} />
      <FAQ translations={translations} locale={validLocale} />
      <ContactUs locale={validLocale} />
      <Footer locale={validLocale} />
    </>
  );
}
