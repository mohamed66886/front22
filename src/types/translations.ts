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
    mission: {
      title: string;
      description: string;
    };
    vision: {
      title: string;
      description: string;
    };
    values: {
      title: string;
      description: string;
    };
    goals: {
      title: string;
      items: string[];
    };
    targetAudience: {
      title: string;
      subtitle: string;
      groups: string[];
    };
    whyThisSystem: {
      title: string;
      reasons: string[];
    };
    team: {
      title: string;
      description: string;
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
