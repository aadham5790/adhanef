import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dataDir = path.join(root, 'data');
const templatesDir = path.join(root, 'templates');
const projectsDir = path.join(root, 'projects');

const projects = JSON.parse(fs.readFileSync(path.join(dataDir, 'projects.json'), 'utf8'));

if (!fs.existsSync(projectsDir)) fs.mkdirSync(projectsDir, { recursive: true });

const template = fs.readFileSync(path.join(templatesDir, 'project.html'), 'utf8');

projects.forEach((project) => {
  const html = template
    .replace(/{{title}}/g, project.title)
    .replace(/{{description}}/g, project.description)
    .replace(/{{slug}}/g, project.slug)
    .replace(/{{category}}/g, project.category)
    .replace(/{{subcategory}}/g, project.subcategory || '')
    .replace(/{{full}}/g, project.full)
    .replace(/{{thumb}}/g, project.thumb)
    .replace(/{{alt}}/g, project.alt)
    .replace(/{{content}}/g, project.content);

  fs.writeFileSync(path.join(projectsDir, `${project.slug}.html`), html);
});

console.log(`Generated ${projects.length} project pages.`);
