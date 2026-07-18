import { environment } from '../../../environments/environment';

export const API = {
  BASE_URL: environment.apiUrl,

  AUTH: {
    LOGIN: '/auth/login',
    PROFILE: '/auth/profile',
    LOGOUT: '/auth/logout',
  },

  HERO: '/hero',

  ABOUT: '/about',

  SKILLS: '/skills',

  EXPERIENCE: '/experience',

  EDUCATION: '/education',

  PROJECTS: '/projects',

  RESUME: '/resume',

  UPLOAD: '/upload',
};