export type Service = {
  id: string;
  name: string;
  price: number;
  currency: string;
  unit: string;
  features: string[];
  cta: string;
  popular: boolean;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  category: string;
  subcategory: string;
  thumbUrl: string;
  fullUrl: string;
  alt: string;
  description: string;
  content: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  date: string;
  readTime: string;
  coverUrl: string;
  content: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  service: string;
  message: string;
  read: boolean;
  createdAt: string;
};
