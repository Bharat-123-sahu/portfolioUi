import { Routes } from '@angular/router';

export const publicRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/public-layout/public-layout.component').then(
        (m) => m.PublicLayoutComponent
      ),

    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home/home.component').then(
            (m) => m.HomeComponent
          ),
      },

      {
        path: 'projects',
        loadComponent: () =>
          import('./pages/projects/projects.component').then(
            (m) => m.ProjectsComponent
          ),
      },

      {
        path: 'projects/:slug',
        loadComponent: () =>
          import('./pages/project-detail/project-detail.component').then(
            (m) => m.ProjectDetailComponent
          ),
      },

      {
        path: 'blogs',
        loadComponent: () =>
          import('./pages/blogs/blogs.component').then(
            (m) => m.BlogsComponent
          ),
      },

      {
        path: 'blogs/:slug',
        loadComponent: () =>
          import('./pages/blog-detail/blog-detail.component').then(
            (m) => m.BlogDetailComponent
          ),
      },

      {
        path: 'contact',
        loadComponent: () =>
          import('./pages/contact/contact.component').then(
            (m) => m.ContactComponent
          ),
      },
    ],
  },
];
