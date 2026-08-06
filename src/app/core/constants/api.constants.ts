import { apiBaseUrl } from '../utils/url.util';

export const API = {
  BASE_URL: apiBaseUrl(),

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
