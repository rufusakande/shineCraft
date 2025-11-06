import path from 'path';
import fs from 'fs/promises';
import { ApiError } from './api.utils';

export interface UploadedFile {
  filename: string;
  path: string;
  url: string;
}

export class FileUtils {
  static readonly UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
  static readonly MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024; // 5MB
  static readonly ALLOWED_MIME_TYPES = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp,image/gif').split(',');
  static readonly MAX_FILES = Number(process.env.MAX_FILES_PER_PRODUCT) || 8;

  static getPublicUrl(filename: string): string {
    if (process.env.FRONTEND_URL) {
      return `${process.env.FRONTEND_URL}/uploads/${filename}`;
    }
    return `/uploads/${filename}`;
  }

  static async ensureUploadDir(): Promise<void> {
    const uploadPath = path.resolve(process.cwd(), this.UPLOAD_DIR);
    try {
      await fs.access(uploadPath);
    } catch {
      await fs.mkdir(uploadPath, { recursive: true });
    }
  }

  static generateFilename(originalname: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = path.extname(originalname);
    const sanitizedName = path.basename(originalname, extension)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');

    return `${timestamp}-${randomString}-${sanitizedName}${extension}`;
  }

  static validateFile(file: Express.Multer.File): void {
    // Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      throw new ApiError(400, `File size exceeds limit of ${this.MAX_FILE_SIZE / 1024 / 1024}MB`);
    }

    // Check file type
    if (!this.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new ApiError(400, `Invalid file type. Allowed types: ${this.ALLOWED_MIME_TYPES.join(', ')}`);
    }
  }

  static async deleteFile(filename: string): Promise<void> {
    try {
      const filepath = path.join(process.cwd(), this.UPLOAD_DIR, filename);
      await fs.unlink(filepath);
    } catch (error) {
      console.error(`Failed to delete file ${filename}:`, error);
    }
  }

  static async deleteFiles(filenames: string[]): Promise<void> {
    await Promise.all(filenames.map(filename => this.deleteFile(filename)));
  }
}

// Initialize upload directory when the application starts
FileUtils.ensureUploadDir();