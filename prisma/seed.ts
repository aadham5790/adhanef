import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";
import path from "node:path";

const prisma = new PrismaClient();
const root = path.join(__dirname, "..");

type RawService = {
  id: string;
  name: string;
  price: number;
  currency: string;
  unit: string;
  features: string[];
  cta: string;
  popular: boolean;
};

type RawProject = {
  id: number;
  title: string;
  slug: string;
  category: string;
  subcategory?: string;
  thumb: string;
  full: string;
  alt?: string;
  description?: string;
  content?: string;
};

type RawPost = {
  id: number;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  date: string;
  readTime: string;
  cover: string;
  content: string;
};

async function main() {
  const services = JSON.parse(readFileSync(path.join(root, "data/services.json"), "utf8")) as RawService[];
  const projects = JSON.parse(readFileSync(path.join(root, "data/projects.json"), "utf8")) as RawProject[];
  const posts = JSON.parse(readFileSync(path.join(root, "data/blog.json"), "utf8")) as RawPost[];

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: service.id },
      update: service,
      create: service
    });
  }

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {
        title: project.title,
        category: project.category,
        subcategory: project.subcategory || "",
        thumbUrl: project.thumb,
        fullUrl: project.full,
        alt: project.alt || project.title,
        description: project.description || "",
        content: project.content || ""
      },
      create: {
        title: project.title,
        slug: project.slug,
        category: project.category,
        subcategory: project.subcategory || "",
        thumbUrl: project.thumb,
        fullUrl: project.full,
        alt: project.alt || project.title,
        description: project.description || "",
        content: project.content || ""
      }
    });
  }

  for (const post of posts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        category: post.category,
        excerpt: post.excerpt,
        date: new Date(post.date),
        readTime: post.readTime,
        coverUrl: post.cover,
        content: post.content
      },
      create: {
        title: post.title,
        slug: post.slug,
        category: post.category,
        excerpt: post.excerpt,
        date: new Date(post.date),
        readTime: post.readTime,
        coverUrl: post.cover,
        content: post.content
      }
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
