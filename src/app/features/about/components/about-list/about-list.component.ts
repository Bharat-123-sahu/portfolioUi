import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  IonicModule,
  ModalController,
  ToastController,
} from '@ionic/angular';

import { About } from '../../models/about.model';
import { AboutService } from '../../services/about';
import { AboutFormComponent } from '../about-form/about-form.component';

import { TableColumn } from 'src/app/shared/models/table-column.model';

import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';
import { SearchToolbarComponent } from 'src/app/shared/components/search-toolbar/search-toolbar.component';
import { LoadingComponent } from 'src/app/shared/components/loading/loading.component';
import { EmptyStateComponent } from 'src/app/shared/components/empty-state/empty-state.component';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';

@Component({
  selector: 'app-about-list',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    PageHeaderComponent,
    SearchToolbarComponent,
    LoadingComponent,
    EmptyStateComponent,
    DataTableComponent,
  ],
  templateUrl: './about-list.component.html',
  styleUrls: ['./about-list.component.scss'],
})
export class AboutListComponent implements OnInit {

  loading = false;

  abouts: About[] = [];

  filteredAbouts: About[] = [];

  paginatedAbouts: About[] = [];

  searchTerm = '';

  currentPage = 1;

  pageSize = 5;

  totalPages = 0;

  columns: TableColumn[] = [
    {
      key: 'profileImage',
      label: 'Image',
      type: 'image',
    },
    {
      key: 'heading',
      label: 'Heading',
    },
    {
      key: 'subHeading',
      label: 'Sub Heading',
    },
    {
      key: 'yearsOfExperience',
      label: 'Experience',
    },
    {
      key: 'totalProjects',
      label: 'Projects',
    },
    {
      key: 'totalClients',
      label: 'Clients',
    },
    {
      key: 'isActive',
      label: 'Status',
      type: 'badge',
    },
  ];

  constructor(
    private aboutService: AboutService,
    private modalController: ModalController,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.loadAbouts();
  }

  loadAbouts(): void {

    this.loading = true;

    this.aboutService.getAll().subscribe({

      next: (response: any) => {

        console.log('About Response:', response);

        // Change this according to your API response
        this.abouts = response.data ?? response.abouts ?? response;

        this.filteredAbouts = [...this.abouts];

        this.currentPage = 1;

        this.updatePagination();

        this.loading = false;

      },

      error: (err) => {

        console.error(err);

        this.loading = false;

      }

    });

  }

  searchAbout(value: string): void {

    this.searchTerm = value.toLowerCase();

    if (!this.searchTerm) {

      this.filteredAbouts = [...this.abouts];

    } else {

      this.filteredAbouts = this.abouts.filter(item =>

        item.heading?.toLowerCase().includes(this.searchTerm) ||

        item.subHeading?.toLowerCase().includes(this.searchTerm)

      );

    }

    this.currentPage = 1;

    this.updatePagination();

  }

  updatePagination(): void {

    this.totalPages = Math.ceil(
      this.filteredAbouts.length / this.pageSize
    );

    const start = (this.currentPage - 1) * this.pageSize;

    this.paginatedAbouts = this.filteredAbouts.slice(
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

  async addAbout(): Promise<void> {

    const modal = await this.modalController.create({

      component: AboutFormComponent,

    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.refresh) {

      this.loadAbouts();

    }

  }

  async editAbout(about: About): Promise<void> {

    const modal = await this.modalController.create({

      component: AboutFormComponent,

      componentProps: {

        about,

      },

    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.refresh) {

      this.loadAbouts();

    }

  }

  async deleteAbout(about: About): Promise<void> {

    const alert = await this.alertController.create({

      header: 'Delete About',

      message: `Are you sure you want to delete <strong> ${about.heading}</strong>?`,

      buttons: [

        'Cancel',

        {

          text: 'Delete',

          role: 'destructive',

          handler: () => {

            this.aboutService.delete(about._id!).subscribe({

              next: async () => {

                const toast = await this.toastController.create({

                  message: 'Deleted successfully.',

                  duration: 2000,

                  color: 'success',

                });

                await toast.present();

                this.loadAbouts();

              },

              error: async () => {

                const toast = await this.toastController.create({

                  message: 'Delete failed.',

                  duration: 2000,

                  color: 'danger',

                });

                await toast.present();

              }

            });

          }

        }

      ]

    });

    await alert.present();

  }

}