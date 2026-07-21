import { BaseModel } from "src/app/core/models/base.model";

export interface Hero extends BaseModel {

  title: string;

  subtitle: string;

  description: string;

  profileImage: string;

  githubUrl?: string;

  linkedinUrl?: string;

  resumeUrl?: string;

  email?: string;

  phone?: string;

  location?: string;

}