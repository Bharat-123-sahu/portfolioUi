import { BaseModel } from 'src/app/core/models/base.model';

export interface Skill extends BaseModel {

  name: string;

  slug: string;

  category: string;

  icon: string;

  percentage: number;

  displayOrder: number;

  isFeatured: boolean;

  isActive: boolean;

}