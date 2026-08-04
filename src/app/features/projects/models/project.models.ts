import { BaseModel } from 'src/app/core/models/base.model';

export interface Project extends BaseModel {

  title: string;

  slug: string;

  shortDescription: string;

  description: string;

  category: string;

  technologies: string[];

  thumbnail: string;

  images: string[];

  githubUrl: string;

  liveDemoUrl: string;

  previewTitle?: string;

  previewDescription?: string;

  previewImage?: string;

  favicon?: string;

  domain?: string;

  playStoreUrl: string;

  appStoreUrl: string;

  isFeatured: boolean;

  displayOrder: number;

  isActive: boolean;

}
