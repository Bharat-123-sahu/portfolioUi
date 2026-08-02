import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonList, IonItem, IonLabel, IonIcon } from '@ionic/angular/standalone';

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
  newspaperOutline,
  callOutline,
  ribbonOutline,
  shareSocialOutline,
  shieldCheckmarkOutline,
} from 'ionicons/icons';

import { addIcons } from 'ionicons';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [CommonModule, RouterModule, IonList, IonItem, IonLabel, IonIcon],
})
export class SidebarComponent {
  menuItems = [
    { title: 'Dashboard', icon: 'home-outline', route: '/dashboard' },
    { title: 'Hero', icon: 'person-outline', route: '/dashboard/hero' },
    { title: 'About', icon: 'person-outline', route: '/dashboard/about' },
    { title: 'Skills', icon: 'code-slash-outline', route: '/dashboard/skills' },
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
    { title: 'Blog', icon: 'newspaper-outline', route: '/dashboard/blog' },
    {
      title: 'Certificate',
      icon: 'ribbon-outline',
      route: '/dashboard/certificate',
    },
    { title: 'Contact', icon: 'call-outline', route: '/dashboard/contact' },
    {
      title: 'Social Links',
      icon: 'share-social-outline',
      route: '/dashboard/social-links',
    },
    {
      title: 'Settings',
      icon: 'settings-outline',
      route: '/dashboard/settings',
    },
    {
      title: 'Security',
      icon: 'shield-checkmark-outline',
      route: '/dashboard/settings/change-password',
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
      newspaperOutline,
      callOutline,
      ribbonOutline,
      shareSocialOutline,
      shieldCheckmarkOutline,
    });
  }
}
