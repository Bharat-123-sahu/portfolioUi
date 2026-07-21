import { BaseModel } from 'src/app/core/models/base.model';

export interface Experience extends BaseModel {

  companyName: string;

  designation: string;

  employmentType: string;

  location: string;

  startDate: Date;

  endDate: Date | null;

  currentlyWorking: boolean;

  companyLogo: string;

  description: string;

  technologies: string[];

  displayOrder: number;

  isActive: boolean;

}