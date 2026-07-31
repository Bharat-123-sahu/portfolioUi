import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  AlertController,
  IonicModule,
  ModalController,
  ToastController,
} from '@ionic/angular';

import { CertificateFormComponent } from '../certificate-form/certificate-form.component';

import { TableColumn } from 'src/app/shared/models/table-column.model';

import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';
import { SearchToolbarComponent } from 'src/app/shared/components/search-toolbar/search-toolbar.component';
import { LoadingComponent } from 'src/app/shared/components/loading/loading.component';
import { EmptyStateComponent } from 'src/app/shared/components/empty-state/empty-state.component';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { Certificate } from '../../models/certificate.models';
import { CertificateService } from '../../services/certificate';

@Component({
  selector: 'app-certificate-list',
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
  templateUrl: './certificate-list.component.html',
  styleUrls: ['./certificate-list.component.scss'],
})
export class CertificateListComponent implements OnInit {
  private certificateService = inject(CertificateService);
  private modalController = inject(ModalController);
  private toastController = inject(ToastController);
  private alertController = inject(AlertController);


  loading = false;

  certificates: Certificate[] = [];

  filteredCertificates: Certificate[] = [];

  paginatedCertificates: Certificate[] = [];

  currentPage = 1;

  pageSize = 10;

  totalPages = 0;

  columns: TableColumn[] = [
    {
      key: 'certificateImage',
      label: 'Image',
      type: 'image',
    },
    {
      key: 'title',
      label: 'Title',
    },
    {
      key: 'issuer',
      label: 'Issuer',
    },
    {
      key: 'issueDate',
      label: 'Issue Date',
      type: 'date',
    },
    {
      key: 'credentialId',
      label: 'Credential ID',
    },
    {
      key: 'isActive',
      label: 'Status',
      type: 'badge',
    },
  ];

  ngOnInit(): void {
    this.loadCertificates();
  }

  loadCertificates(): void {

    this.loading = true;

    this.certificateService.getAll().subscribe({

      next: (response: any) => {

        const certificates =
          response?.data?.certificates ?? response?.certificates ?? response;

        this.certificates = Array.isArray(certificates) ? certificates : [];

        this.filteredCertificates = [...this.certificates];

        this.currentPage = 1;

        this.updatePagination();

        this.loading = false;

      },

      error: () => {

        this.loading = false;

      }

    });

  }

  searchCertificates(keyword: string): void {

    keyword = keyword.toLowerCase();

    if (!keyword) {

      this.filteredCertificates = [...this.certificates];

    } else {

      this.filteredCertificates = this.certificates.filter(item =>

        item.title.toLowerCase().includes(keyword) ||

        item.issuer.toLowerCase().includes(keyword) ||

        item.credentialId.toLowerCase().includes(keyword)

      );

    }

    this.currentPage = 1;

    this.updatePagination();

  }

  updatePagination(): void {

    this.totalPages = Math.ceil(
      this.filteredCertificates.length / this.pageSize
    );

    const start = (this.currentPage - 1) * this.pageSize;

    this.paginatedCertificates = this.filteredCertificates.slice(
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

  async addCertificate(): Promise<void> {

    const modal = await this.modalController.create({

      component: CertificateFormComponent,

    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.refresh) {

      this.loadCertificates();

    }

  }

  async editCertificate(certificate: Certificate): Promise<void> {

    const modal = await this.modalController.create({

      component: CertificateFormComponent,

      componentProps: {

        certificate,

      },

    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.refresh) {

      this.loadCertificates();

    }

  }

  async deleteCertificate(certificate: Certificate): Promise<void> {

    const alert = await this.alertController.create({

      header: 'Delete Certificate',

      message: `Delete <strong>${certificate.title}</strong>?`,

      buttons: [

        'Cancel',

        {

          text: 'Delete',

          role: 'destructive',

          handler: () => {

            this.certificateService.delete(certificate._id!).subscribe({

              next: async () => {

                const toast = await this.toastController.create({

                  message: 'Certificate deleted successfully.',

                  color: 'success',

                  duration: 2000,

                });

                await toast.present();

                this.loadCertificates();

              }

            });

          }

        }

      ]

    });

    await alert.present();

  }

}
