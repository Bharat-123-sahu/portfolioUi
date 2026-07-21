import { BaseModel } from 'src/app/core/models/base.model';

export interface About extends BaseModel {
  heading: string;
  subHeading: string;
  description: string;
  profileImage: string;
  yearsOfExperience: number;
  totalProjects: number;
  totalClients: number;
  totalCertificates: number;
  resumeUrl: string;
  isActive: boolean;
}
