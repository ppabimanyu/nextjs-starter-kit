import { put, del } from "@vercel/blob";
import { env } from "@/lib/env";
import { writeFile, unlink, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export type StorageProvider = "local" | "vercel-blob";

export interface UploadOptions {
  /** Folder path within storage (e.g., "avatars") */
  folder?: string;
  /** Custom filename (without extension) */
  filename?: string;
  /** Content type override */
  contentType?: string;
}

export interface UploadResult {
  url: string;
  pathname: string;
}

/**
 * Get the current storage provider from environment
 */
export function getStorageProvider(): StorageProvider {
  const provider = env.STORAGE_PROVIDER;
  if (provider === "vercel-blob" || provider === "local") {
    return provider;
  }
  // Default to local for unknown providers (including "s3" which is not implemented)
  return "local";
}

/**
 * Upload a file to the configured storage provider
 */
export async function uploadFile(
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const provider = getStorageProvider();

  // Generate filename with original extension
  const ext = file.name.split(".").pop() || "bin";
  const filename = options.filename
    ? `${options.filename}.${ext}`
    : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;

  const folder = options.folder || "";
  const pathname = folder ? `${folder}/${filename}` : filename;

  if (provider === "vercel-blob") {
    return uploadToVercelBlob(file, pathname, options.contentType);
  } else {
    return uploadToLocal(file, pathname);
  }
}

/**
 * Delete a file from the configured storage provider
 */
export async function deleteFile(url: string): Promise<void> {
  const provider = getStorageProvider();

  if (provider === "vercel-blob") {
    await deleteFromVercelBlob(url);
  } else {
    await deleteFromLocal(url);
  }
}

// ============================================================================
// Vercel Blob Implementation
// ============================================================================

async function uploadToVercelBlob(
  file: File,
  pathname: string,
  contentType?: string
): Promise<UploadResult> {
  const blob = await put(pathname, file, {
    access: "public",
    contentType: contentType || file.type,
    token: env.BLOB_READ_WRITE_TOKEN,
  });

  return {
    url: blob.url,
    pathname: blob.pathname,
  };
}

async function deleteFromVercelBlob(url: string): Promise<void> {
  await del(url, {
    token: env.BLOB_READ_WRITE_TOKEN,
  });
}

// ============================================================================
// Local Storage Implementation
// ============================================================================

const LOCAL_UPLOAD_DIR = "public/uploads";

async function uploadToLocal(
  file: File,
  pathname: string
): Promise<UploadResult> {
  const fullPath = path.join(process.cwd(), LOCAL_UPLOAD_DIR, pathname);
  const dir = path.dirname(fullPath);

  // Ensure directory exists
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }

  // Write file
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(fullPath, buffer);

  // Return public URL (without 'public' prefix)
  const publicUrl = `/uploads/${pathname}`;

  return {
    url: publicUrl,
    pathname: pathname,
  };
}

async function deleteFromLocal(url: string): Promise<void> {
  // Convert public URL to file path
  // URL format: /uploads/avatars/filename.ext
  if (!url.startsWith("/uploads/")) {
    // Not a local file, skip
    return;
  }

  const relativePath = url.replace("/uploads/", "");
  const fullPath = path.join(process.cwd(), LOCAL_UPLOAD_DIR, relativePath);

  try {
    if (existsSync(fullPath)) {
      await unlink(fullPath);
    }
  } catch (error) {
    console.error("Failed to delete local file:", error);
    // Don't throw - file might already be deleted
  }
}
