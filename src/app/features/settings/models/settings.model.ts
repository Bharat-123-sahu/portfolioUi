import { BaseModel } from 'src/app/core/models/base.model';

export interface PortfolioSettings extends BaseModel {

  // Site Information
  siteTitle: string;
  siteDescription: string;
  siteKeywords: string[];
  siteAuthor: string;

  // Branding
  logo: string;
  favicon: string;

  // Theme
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;

  // Hero
  defaultProfileImage: string;
  defaultResume: string;

  // Contact
  contactEmail: string;
  supportEmail: string;
  phone: string;

  // Address
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;

  // SEO
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];

  // Analytics
  googleAnalyticsId: string;
  googleTagManagerId: string;

  // Features
  maintenanceMode: boolean;
  enableBlog: boolean;
  enableProjects: boolean;
  enableContactForm: boolean;

  isActive: boolean;

}