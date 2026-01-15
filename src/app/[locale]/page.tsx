import type { Metadata } from 'next';
import { Locale } from '@/i18n/config';
import { getTranslations } from '@/i18n/utils';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import LatestNews from '@/components/LatestNews';
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
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const translations = getTranslations(locale);

  return (
    <>
      <Header translations={translations} locale={locale} />
      <Hero translations={translations} locale={locale} />
      <LatestNews translations={translations} locale={locale} />
      <FAQ translations={translations} locale={locale} />
      <ContactUs locale={locale} />
      <Footer locale={locale} />
    </>
  );
}
