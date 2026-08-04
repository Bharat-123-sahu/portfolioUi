import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { publicRoutes } from './public/public.routes';

export const routes: Routes = [
  {
    path: '',
    children: publicRoutes,
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'login/forgot-password',
    loadComponent: () =>
      import('./features/auth/pages/forgot-password/forgot-password.page').then(
        (m) => m.ForgotPasswordPage,
      ),
  },
  {
    path: 'login/verify-otp',
    loadComponent: () =>
      import('./features/auth/pages/verify-otp/verify-otp.page').then(
        (m) => m.VerifyOtpPage,
      ),
  },
  {
    path: 'login/reset-password',
    loadComponent: () =>
      import('./features/auth/pages/reset-password/reset-password.page').then(
        (m) => m.ResetPasswordPage,
      ),
  },
  {
    path: 'auth/setup-admin',
    loadComponent: () =>
      import('./features/auth/pages/setup-admin/setup-admin.page').then(
        (m) => m.SetupAdminPage,
      ),
  },

  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/dashboard/dashboard.page').then((m) => m.DashboardPage),

    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard/dashboard.page').then(
            (m) => m.DashboardPage,
          ),
      },

      {
        path: 'hero',
        loadComponent: () =>
          import('./features/hero/pages/hero/hero.page').then(
            (m) => m.HeroPage,
          ),
      },

      {
        path: 'about',
        loadComponent: () =>
          import('./features/about/pages/about/about.page').then(
            (m) => m.AboutPage,
          ),
      },

      {
        path: 'skills',
        loadComponent: () =>
          import('./features/skills/pages/skills/skills.page').then(
            (m) => m.SkillsPage,
          ),
      },

      {
        path: 'experience',
        loadComponent: () =>
          import('./features/experience/pages/experience/experience.page').then(
            (m) => m.ExperiencePage,
          ),
      },

      {
        path: 'education',
        loadComponent: () =>
          import('./features/education/pages/education/education.page').then(
            (m) => m.EducationPage,
          ),
      },

      {
        path: 'projects',
        loadComponent: () =>
          import('./features/projects/pages/projects/projects.page').then(
            (m) => m.ProjectsPage,
          ),
      },

      {
        path: 'resume',
        loadComponent: () =>
          import('./features/resume/pages/resume/resume.page').then(
            (m) => m.ResumePage,
          ),
      },
      {
        path: 'certificate',
        loadComponent: () =>
          import('./features/certificate/pages/certificate/certificate.page').then(
            (m) => m.CertificatePage,
          ),
      },
      {
        path: 'blog',
        loadComponent: () =>
          import('./features/blog/pages/blog/blog.page').then(
            (m) => m.BlogPage,
          ),
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./features/contact/pages/contact/contact.page').then(
            (m) => m.ContactPage,
          ),
      },
      {
        path: 'settings/change-password',
        loadComponent: () =>
          import('./features/auth/pages/change-password/change-password.page').then(
            (m) => m.ChangePasswordPage,
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/pages/settings/settings.page').then(
            (m) => m.SettingsPage,
          ),
      },
      {
        path: 'social-links',
        loadComponent: () =>
          import('./features/social-links/pages/social-links/social-links.page').then(
            (m) => m.SocialLinksPage,
          ),
      },
    ],
  },

  {
    path: '**',
    redirectTo: '',
  },
];
