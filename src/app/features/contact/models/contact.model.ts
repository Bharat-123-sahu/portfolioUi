import { BaseModel } from 'src/app/core/models/base.model';

export interface Contact extends BaseModel {

  name: string;

  designation: string;

  email: string;

  phone: string;

  alternatePhone: string;

  website: string;

  address: string;

  city: string;

  state: string;

  country: string;

  postalCode: string;

  googleMapUrl: string;

  profileImage: string;

  resumeUrl: string;

  workingHours: string;

  availableForHire: boolean;

  displayOrder: number;

  isActive: boolean;

}