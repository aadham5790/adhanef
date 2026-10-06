import { put } from "@vercel/blob";
import { promises as fs } from "node:fs";
import path from "node:path";

export async function saveUpload(file: File, folder: string) {
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "-");
  const filename = `${folder}/${Date.now()}-${safeName}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(filename, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN
    });
    return blob.url;
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const dest = path.join(process.cwd(), "public", "uploads", filename);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, bytes);
  return `/uploads/${filename}`;
}
