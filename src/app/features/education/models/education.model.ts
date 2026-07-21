import { BaseModel } from 'src/app/core/models/base.model';

export interface Education extends BaseModel {

  instituteName: string;

  degree: string;

  fieldOfStudy: string;

  location: string;

  startYear: number;

  endYear: number;

  grade: string;

  description: string;

  instituteLogo: string;

  displayOrder: number;

  isActive: boolean;

}