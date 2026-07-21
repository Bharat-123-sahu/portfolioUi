import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SocialLinkListComponent } from '../../components/social-links-list/social-links-list.component';

@Component({
  selector: 'app-social-link-page',
  standalone: true,
  imports: [CommonModule, IonicModule, SocialLinkListComponent],
  templateUrl: './social-links.page.html',
  styleUrls: ['./social-links.page.scss'],
})
export class SocialLinksPage {}
