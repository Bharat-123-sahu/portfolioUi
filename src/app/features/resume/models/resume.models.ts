import { BaseModel } from 'src/app/core/models/base.model';

export interface Resume extends BaseModel {

  title: string;

  version: string;

  resumeFile: string;

  description: string;

  displayOrder: number;

  isDefault: boolean;

  isActive: boolean;

}