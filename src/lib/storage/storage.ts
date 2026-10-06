import { writeFile, mkdir, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const UPLOAD_DIR = process.env.UPLOAD_DIR || './public/uploads';

export interface UploadResult {
  url: string;
  fileName: string;
  fileSize: number;
  fileType: string;
}

export async function saveFile(
  file: File,
  subDirectory: string = 'general'
): Promise<UploadResult> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const dir = path.join(UPLOAD_DIR, subDirectory);

  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }

  const timestamp = Date.now();
  const originalName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
  const fileName = `${timestamp}_${originalName}`;
  const filePath = path.join(dir, fileName);

  await writeFile(filePath, buffer);

  return {
    url: `/uploads/${subDirectory}/${fileName}`,
    fileName: originalName,
    fileSize: file.size,
    fileType: file.type,
  };
}

export async function deleteFile(fileUrl: string): Promise<void> {
  const filePath = path.join(process.cwd(), 'public', fileUrl);
  try {
    await unlink(filePath);
  } catch {
    // File might not exist
  }
}

export function getFileUrl(filePath: string): string {
  if (filePath.startsWith('http')) return filePath;
  return filePath;
}

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

export const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/ogg',
];

export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];

export const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '52428800'); // 50MB

export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

export function validateFileSize(file: File, maxSize: number = MAX_FILE_SIZE): boolean {
  return file.size <= maxSize;
}
