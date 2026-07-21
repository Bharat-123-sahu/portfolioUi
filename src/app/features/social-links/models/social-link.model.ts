import { BaseModel } from 'src/app/core/models/base.model';

export interface SocialLink extends BaseModel {

  platform: string;

  username: string;

  url: string;

  icon: string;

  color: string;

  displayOrder: number;

  isVisible: boolean;

  isActive: boolean;

}