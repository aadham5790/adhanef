import { promises as fs } from "node:fs";
import path from "node:path";
import { hasDatabase, getPrisma } from "./prisma";
import type { BlogPost, ContactMessage, Project, Service } from "./types";
import blogJson from "../data/blog.json";
import projectsJson from "../data/projects.json";
import servicesJson from "../data/services.json";

const dataDir = path.join(process.cwd(), "data");
const messagesFile = path.join(dataDir, "messages.json");

type RawProject = {
  id: number | string;
  title: string;
  slug: string;
  category: string;
  subcategory?: string;
  thumb?: string;
  full?: string;
  thumbUrl?: string;
  fullUrl?: string;
  alt?: string;
  description?: string;
  content?: string;
};

type RawPost = {
  id: number | string;
  title: string;
  slug: string;
  category?: string;
  excerpt?: string;
  date: string;
  readTime?: string;
  cover?: string;
  coverUrl?: string;
  content?: string;
};

function mapProject(item: RawProject): Project {
  return {
    id: String(item.id),
    title: item.title,
    slug: item.slug,
    category: item.category,
    subcategory: item.subcategory || "",
    thumbUrl: item.thumbUrl || item.thumb || "",
    fullUrl: item.fullUrl || item.full || "",
    alt: item.alt || item.title,
    description: item.description || "",
    content: item.content || ""
  };
}

function mapPost(item: RawPost): BlogPost {
  return {
    id: String(item.id),
    title: item.title,
    slug: item.slug,
    category: item.category || "",
    excerpt: item.excerpt || "",
    date: item.date.slice(0, 10),
    readTime: item.readTime || "",
    coverUrl: item.coverUrl || item.cover || "",
    content: item.content || ""
  };
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(file: string, data: unknown) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 2));
}

export async function getServices(): Promise<Service[]> {
  if (hasDatabase()) {
    return getPrisma().service.findMany({ orderBy: { name: "asc" } });
  }
  return (servicesJson as Service[]).map((s) => ({ ...s, features: [...s.features] }));
}

export async function getProjects(): Promise<Project[]> {
  if (hasDatabase()) {
    const rows = await getPrisma().project.findMany({ orderBy: { createdAt: "desc" } });
    return rows.map((row) => ({
      ...row,
      description: row.description,
      content: row.content
    }));
  }
  return (projectsJson as RawProject[]).map(mapProject);
}

export async function getProjectBySlug(slug: string) {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug) || null;
}

export async function getPosts(): Promise<BlogPost[]> {
  if (hasDatabase()) {
    const rows = await getPrisma().blogPost.findMany({ orderBy: { date: "desc" } });
    return rows.map((row) => ({
      ...row,
      date: row.date.toISOString().slice(0, 10)
    }));
  }
  return (blogJson as RawPost[]).map(mapPost);
}

export async function getPostBySlug(slug: string) {
  const posts = await getPosts();
  return posts.find((post) => post.slug === slug) || null;
}

export async function getLatestPosts(limit = 3) {
  const posts = await getPosts();
  return [...posts]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}

export async function createService(data: Service) {
  if (hasDatabase()) {
    return getPrisma().service.create({ data });
  }
  const services = await getServices();
  if (services.some((s) => s.id === data.id)) {
    throw new Error("Service id already exists");
  }
  services.push(data);
  await writeJson(path.join(dataDir, "services.json"), services);
  return data;
}

export async function updateService(id: string, data: Partial<Service>) {
  if (hasDatabase()) {
    return getPrisma().service.update({ where: { id }, data });
  }
  const services = await getServices();
  const index = services.findIndex((s) => s.id === id);
  if (index === -1) throw new Error("Service not found");
  services[index] = { ...services[index], ...data, id };
  await writeJson(path.join(dataDir, "services.json"), services);
  return services[index];
}

export async function deleteService(id: string) {
  if (hasDatabase()) {
    await getPrisma().service.delete({ where: { id } });
    return;
  }
  const services = (await getServices()).filter((s) => s.id !== id);
  await writeJson(path.join(dataDir, "services.json"), services);
}

export async function createProject(data: Omit<Project, "id"> & { id?: string }) {
  if (hasDatabase()) {
    return getPrisma().project.create({
      data: {
        title: data.title,
        slug: data.slug,
        category: data.category,
        subcategory: data.subcategory || "",
        thumbUrl: data.thumbUrl || "",
        fullUrl: data.fullUrl || "",
        alt: data.alt || "",
        description: data.description || "",
        content: data.content || ""
      }
    });
  }
  const projects = (projectsJson as RawProject[]).map(mapProject);
  const next: Project = { ...data, id: data.id || String(Date.now()) };
  const all = [...(await getProjects()).filter((p) => p.id !== next.id), next];
  await writeJson(
    path.join(dataDir, "projects.json"),
    all.map((p) => ({
      id: Number.isNaN(Number(p.id)) ? p.id : Number(p.id),
      title: p.title,
      slug: p.slug,
      category: p.category,
      subcategory: p.subcategory,
      thumb: p.thumbUrl,
      full: p.fullUrl,
      alt: p.alt,
      description: p.description,
      content: p.content
    }))
  );
  return next;
}

export async function updateProject(id: string, data: Partial<Project>) {
  if (hasDatabase()) {
    return getPrisma().project.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        category: data.category,
        subcategory: data.subcategory,
        thumbUrl: data.thumbUrl,
        fullUrl: data.fullUrl,
        alt: data.alt,
        description: data.description,
        content: data.content
      }
    });
  }
  const projects = await getProjects();
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) throw new Error("Project not found");
  projects[index] = { ...projects[index], ...data, id };
  await writeJson(
    path.join(dataDir, "projects.json"),
    projects.map((p) => ({
      id: Number.isNaN(Number(p.id)) ? p.id : Number(p.id),
      title: p.title,
      slug: p.slug,
      category: p.category,
      subcategory: p.subcategory,
      thumb: p.thumbUrl,
      full: p.fullUrl,
      alt: p.alt,
      description: p.description,
      content: p.content
    }))
  );
  return projects[index];
}

export async function deleteProject(id: string) {
  if (hasDatabase()) {
    await getPrisma().project.delete({ where: { id } });
    return;
  }
  const projects = (await getProjects()).filter((p) => p.id !== id);
  await writeJson(
    path.join(dataDir, "projects.json"),
    projects.map((p) => ({
      id: Number.isNaN(Number(p.id)) ? p.id : Number(p.id),
      title: p.title,
      slug: p.slug,
      category: p.category,
      subcategory: p.subcategory,
      thumb: p.thumbUrl,
      full: p.fullUrl,
      alt: p.alt,
      description: p.description,
      content: p.content
    }))
  );
}

export async function createPost(data: Omit<BlogPost, "id"> & { id?: string }) {
  if (hasDatabase()) {
    return getPrisma().blogPost.create({
      data: {
        title: data.title,
        slug: data.slug,
        category: data.category || "",
        excerpt: data.excerpt || "",
        date: new Date(data.date),
        readTime: data.readTime || "",
        coverUrl: data.coverUrl || "",
        content: data.content || ""
      }
    });
  }
  const posts = await getPosts();
  const next: BlogPost = { ...data, id: data.id || String(Date.now()) };
  posts.unshift(next);
  await writeJson(
    path.join(dataDir, "blog.json"),
    posts.map((p) => ({
      id: Number.isNaN(Number(p.id)) ? p.id : Number(p.id),
      title: p.title,
      slug: p.slug,
      category: p.category,
      excerpt: p.excerpt,
      date: p.date,
      readTime: p.readTime,
      cover: p.coverUrl,
      content: p.content
    }))
  );
  return next;
}

export async function updatePost(id: string, data: Partial<BlogPost>) {
  if (hasDatabase()) {
    return getPrisma().blogPost.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        category: data.category,
        excerpt: data.excerpt,
        date: data.date ? new Date(data.date) : undefined,
        readTime: data.readTime,
        coverUrl: data.coverUrl,
        content: data.content
      }
    });
  }
  const posts = await getPosts();
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) throw new Error("Post not found");
  posts[index] = { ...posts[index], ...data, id };
  await writeJson(
    path.join(dataDir, "blog.json"),
    posts.map((p) => ({
      id: Number.isNaN(Number(p.id)) ? p.id : Number(p.id),
      title: p.title,
      slug: p.slug,
      category: p.category,
      excerpt: p.excerpt,
      date: p.date,
      readTime: p.readTime,
      cover: p.coverUrl,
      content: p.content
    }))
  );
  return posts[index];
}

export async function deletePost(id: string) {
  if (hasDatabase()) {
    await getPrisma().blogPost.delete({ where: { id } });
    return;
  }
  const posts = (await getPosts()).filter((p) => p.id !== id);
  await writeJson(
    path.join(dataDir, "blog.json"),
    posts.map((p) => ({
      id: Number.isNaN(Number(p.id)) ? p.id : Number(p.id),
      title: p.title,
      slug: p.slug,
      category: p.category,
      excerpt: p.excerpt,
      date: p.date,
      readTime: p.readTime,
      cover: p.coverUrl,
      content: p.content
    }))
  );
}

export async function getMessages(): Promise<ContactMessage[]> {
  if (hasDatabase()) {
    const rows = await getPrisma().contactMessage.findMany({ orderBy: { createdAt: "desc" } });
    return rows.map((row) => ({
      ...row,
      createdAt: row.createdAt.toISOString()
    }));
  }
  return readJson<ContactMessage[]>(messagesFile, []);
}

export async function createMessage(data: Omit<ContactMessage, "id" | "read" | "createdAt">) {
  if (hasDatabase()) {
    return getPrisma().contactMessage.create({ data });
  }
  const messages = await getMessages();
  const next: ContactMessage = {
    ...data,
    id: String(Date.now()),
    read: false,
    createdAt: new Date().toISOString()
  };
  messages.unshift(next);
  await writeJson(messagesFile, messages);
  return next;
}

export async function markMessageRead(id: string, read = true) {
  if (hasDatabase()) {
    return getPrisma().contactMessage.update({ where: { id }, data: { read } });
  }
  const messages = await getMessages();
  const index = messages.findIndex((m) => m.id === id);
  if (index === -1) throw new Error("Message not found");
  messages[index].read = read;
  await writeJson(messagesFile, messages);
  return messages[index];
}

export async function deleteMessage(id: string) {
  if (hasDatabase()) {
    await getPrisma().contactMessage.delete({ where: { id } });
    return;
  }
  const messages = (await getMessages()).filter((m) => m.id !== id);
  await writeJson(messagesFile, messages);
}
