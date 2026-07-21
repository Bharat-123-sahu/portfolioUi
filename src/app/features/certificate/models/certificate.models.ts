import { BaseModel } from 'src/app/core/models/base.model';

export interface Certificate extends BaseModel {

  title: string;

  issuer: string;

  issueDate: Date;

  expiryDate?: Date;

  credentialId: string;

  credentialUrl: string;

  certificateImage: string;

  certificateFile: string;

  description: string;

  displayOrder: number;

  isActive: boolean;

}