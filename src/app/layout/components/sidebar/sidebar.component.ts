import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
} from '@ionic/angular/standalone';

import { RouterModule } from '@angular/router';

import {
  homeOutline,
  personOutline,
  codeSlashOutline,
  briefcaseOutline,
  schoolOutline,
  folderOpenOutline,
  documentTextOutline,
  settingsOutline,
} from 'ionicons/icons';

import { addIcons } from 'ionicons';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    IonContent,
    IonList,
    IonItem,
    // IonLabel,
    // IonIcon,
  ],
})
export class SidebarComponent {
  menuItems = [
    { title: 'Dashboard', icon: 'home-outline', route: '/dashboard' },
    { title: 'Hero', icon: 'person-outline', route: '/dashboard/hero' },
    { title: 'About', icon: 'person-outline', route: '/dashboard/about' },
    { title: 'Skills', icon: 'code-slash-outline', route: '/dashboard/skills' },
    { title: 'Blog', icon: 'code-slash-outline', route: '/dashboard/blog' },
    { title: 'Contact', icon: 'code-slash-outline', route: '/dashboard/contact' },
    { title: 'Certificate', icon: 'code-slash-outline', route: '/dashboard/certificate' },
    { title: 'Social Links', icon: 'code-slash-outline', route: '/dashboard/social-links' },
    {
      title: 'Experience',
      icon: 'briefcase-outline',
      route: '/dashboard/experience',
    },
    {
      title: 'Education',
      icon: 'school-outline',
      route: '/dashboard/education',
    },
    {
      title: 'Projects',
      icon: 'folder-open-outline',
      route: '/dashboard/projects',
    },
    {
      title: 'Resume',
      icon: 'document-text-outline',
      route: '/dashboard/resume',
    },
    {
      title: 'Settings',
      icon: 'settings-outline',
      route: '/dashboard/settings',
    },
  ];

  constructor() {
    addIcons({
      homeOutline,
      personOutline,
      codeSlashOutline,
      briefcaseOutline,
      schoolOutline,
      folderOpenOutline,
      documentTextOutline,
      settingsOutline,
    });
  }
}
