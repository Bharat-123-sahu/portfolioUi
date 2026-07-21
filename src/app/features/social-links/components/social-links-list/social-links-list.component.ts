import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  IonicModule,
  ModalController,
  ToastController
} from '@ionic/angular';

import { SocialLink } from '../../models/social-link.model';

import { TableColumn } from 'src/app/shared/models/table-column.model';

import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';
import { SearchToolbarComponent } from 'src/app/shared/components/search-toolbar/search-toolbar.component';
import { LoadingComponent } from 'src/app/shared/components/loading/loading.component';
import { EmptyStateComponent } from 'src/app/shared/components/empty-state/empty-state.component';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { SocialLinkService } from '../../services/social-links';
import { SocialLinkFormComponent } from '../social-links-form/social-links-form.component';

@Component({
  selector: 'app-social-link-list',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,

    PageHeaderComponent,
    SearchToolbarComponent,
    LoadingComponent,
    EmptyStateComponent,
    DataTableComponent
  ],
  templateUrl: './social-links-list.component.html',
  styleUrls: ['./social-links-list.component.scss']
})
export class SocialLinkListComponent implements OnInit {

  loading = false;

  socialLinks: SocialLink[] = [];

  filteredSocialLinks: SocialLink[] = [];

  paginatedSocialLinks: SocialLink[] = [];

  currentPage = 1;

  pageSize = 10;

  totalPages = 0;

  columns: TableColumn[] = [

    {
      key: 'platform',
      label: 'Platform',
      type: 'platform'
    },

    {
      key: 'username',
      label: 'Username'
    },

    {
      key: 'url',
      label: 'Profile',
      type: 'link'
    },

    {
      key: 'isVisible',
      label: 'Visible',
      type: 'boolean'
    },

    {
      key: 'isActive',
      label: 'Status',
      type: 'boolean'
    }

  ];

  constructor(
    private socialLinkService: SocialLinkService,
    private modalController: ModalController,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {

    this.loadSocialLinks();

  }

  loadSocialLinks(): void {

    this.loading = true;

    this.socialLinkService.getAll().subscribe({

      next: (response: any) => {

        this.socialLinks = response.data ?? response;

        this.filteredSocialLinks = [...this.socialLinks];

        this.currentPage = 1;

        this.updatePagination();

        this.loading = false;

      },

      error: () => {

        this.loading = false;

      }

    });

  }

  search(keyword: string): void {

    keyword = keyword.toLowerCase();

    if (!keyword) {

      this.filteredSocialLinks = [...this.socialLinks];

    } else {

      this.filteredSocialLinks = this.socialLinks.filter(item =>

        item.platform.toLowerCase().includes(keyword) ||

        item.username.toLowerCase().includes(keyword) ||

        item.url.toLowerCase().includes(keyword)

      );

    }

    this.currentPage = 1;

    this.updatePagination();

  }

  updatePagination(): void {

    this.totalPages = Math.ceil(
      this.filteredSocialLinks.length / this.pageSize
    );

    const start = (this.currentPage - 1) * this.pageSize;

    this.paginatedSocialLinks = this.filteredSocialLinks.slice(

      start,

      start + this.pageSize

    );

  }

  previousPage(): void {

    if (this.currentPage > 1) {

      this.currentPage--;

      this.updatePagination();

    }

  }

  nextPage(): void {

    if (this.currentPage < this.totalPages) {

      this.currentPage++;

      this.updatePagination();

    }

  }

  async addSocialLink(): Promise<void> {

    const modal = await this.modalController.create({

      component: SocialLinkFormComponent

    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.refresh) {

      this.loadSocialLinks();

    }

  }

  async editSocialLink(
    socialLink: SocialLink
  ): Promise<void> {

    const modal = await this.modalController.create({

      component: SocialLinkFormComponent,

      componentProps: {

        socialLink

      }

    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.refresh) {

      this.loadSocialLinks();

    }

  }

  async deleteSocialLink(
    socialLink: SocialLink
  ): Promise<void> {

    const alert = await this.alertController.create({

      header: 'Delete Social Link',

      message: `Delete ${socialLink.platform}?`,

      buttons: [

        'Cancel',

        {

          text: 'Delete',

          role: 'destructive',

          handler: () => {

            this.socialLinkService
              .delete(socialLink._id!)
              .subscribe({

                next: async () => {

                  const toast =
                    await this.toastController.create({

                      message:
                        'Social link deleted successfully.',

                      duration: 2000,

                      color: 'success'

                    });

                  await toast.present();

                  this.loadSocialLinks();

                }

              });

          }

        }

      ]

    });

    await alert.present();

  }

}