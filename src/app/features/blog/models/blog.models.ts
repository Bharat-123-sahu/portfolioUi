import { BaseModel } from 'src/app/core/models/base.model';

export interface Blog extends BaseModel {

  title: string;

  slug: string;

  shortDescription: string;

  content: string;

  featuredImage: string;

  gallery: string[];

  tags: string[];

  category: string;

  author: string;

  publishedDate: Date;

  readingTime: number;

  isFeatured: boolean;

  seoTitle: string;

  seoDescription: string;

  displayOrder: number;

  isPublished: boolean;

  isActive: boolean;

}