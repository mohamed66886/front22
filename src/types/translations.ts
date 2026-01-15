export interface Translations {
  header: {
    home: string;
    news: string;
    about: string;
    faq: string;
    contact: string;
    login: string;
    register: string;
    profile: string;
  };
  hero: {
    title: string;
    subtitle: string;
    cta: string;
    learnMore: string;
  };
  news: {
    title: string;
    subtitle: string;
    readMore: string;
    articles: Array<{
      id: number;
      title: string;
      description: string;
      date: string;
      category?: string;
      image?: string;
    }>;
  };
  about: {
    title: string;
    subtitle: string;
    description: string;
    overview: {
      title: string;
      academicExcellence: string;
      academicExcellenceDesc: string;
      globalStandards: string;
      globalStandardsDesc: string;
    };
    services: {
      title: string;
      subtitle: string;
      subtitleLine2: string;
      students: string;
      staff: string;
      graduates: string;
    };
  };
  faq: {
    title: string;
    subtitle: string;
    questions: Array<{
      id: number;
      question: string;
      answer: string;
    }>;
  };
  contact: {
    title: string;
    subtitle: string;
    form: {
      name: string;
      email: string;
      phone: string;
      message: string;
      send: string;
      sending: string;
      success: string;
      error: string;
    };
    info: {
      address: string;
      email: string;
      phone: string;
    };
  };
  footer: {
    description: string;
    quickLinks: string;
    followUs: string;
    copyright: string;
  };
}
