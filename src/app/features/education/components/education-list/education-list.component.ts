import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  IonicModule,
  ModalController,
  ToastController,
} from '@ionic/angular';

import { Education } from '../../models/education.model';
import { EducationFormComponent } from '../education-form/education-form.component';

import { TableColumn } from 'src/app/shared/models/table-column.model';

import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';
import { SearchToolbarComponent } from 'src/app/shared/components/search-toolbar/search-toolbar.component';
import { LoadingComponent } from 'src/app/shared/components/loading/loading.component';
import { EmptyStateComponent } from 'src/app/shared/components/empty-state/empty-state.component';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { EducationService } from '../../services/education';

@Component({
  selector: 'app-education-list',
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
  templateUrl: './education-list.component.html',
  styleUrls: ['./education-list.component.scss'],
})
export class EducationListComponent implements OnInit {

  loading = false;

  educations: Education[] = [];

  filteredEducations: Education[] = [];

  paginatedEducations: Education[] = [];

  currentPage = 1;

  pageSize = 10;

  totalPages = 0;

  columns: TableColumn[] = [
    {
      key: 'instituteLogo',
      label: 'Logo',
      type: 'image',
    },
    {
      key: 'instituteName',
      label: 'Institute',
    },
    {
      key: 'degree',
      label: 'Degree',
    },
    {
      key: 'fieldOfStudy',
      label: 'Field',
    },
    {
      key: 'grade',
      label: 'Grade',
    },
    {
      key: 'startYear',
      label: 'Start',
    },
    {
      key: 'endYear',
      label: 'End',
    },
    {
      key: 'isActive',
      label: 'Status',
      type: 'badge',
    },
  ];

  constructor(
    private educationService: EducationService,
    private modalController: ModalController,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.loadEducations();
  }

  loadEducations(): void {

    this.loading = true;

    this.educationService.getAll().subscribe({

      next: (response: any) => {

        this.educations = response.education ?? response;

        this.filteredEducations = [...this.educations];

        this.currentPage = 1;

        this.updatePagination();

        this.loading = false;

      },

      error: () => {

        this.loading = false;

      }

    });

  }

  searchEducations(keyword: string): void {

    keyword = keyword.toLowerCase();

    if (!keyword) {

      this.filteredEducations = [...this.educations];

    } else {

      this.filteredEducations = this.educations.filter(item =>

        item.instituteName.toLowerCase().includes(keyword) ||

        item.degree.toLowerCase().includes(keyword) ||

        item.fieldOfStudy.toLowerCase().includes(keyword) ||

        item.location.toLowerCase().includes(keyword)

      );

    }

    this.currentPage = 1;

    this.updatePagination();

  }

  updatePagination(): void {

    this.totalPages = Math.ceil(
      this.filteredEducations.length / this.pageSize
    );

    const start = (this.currentPage - 1) * this.pageSize;

    this.paginatedEducations = this.filteredEducations.slice(
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

  async addEducation(): Promise<void> {

    const modal = await this.modalController.create({

      component: EducationFormComponent,

    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.refresh) {

      this.loadEducations();

    }

  }

  async editEducation(education: Education): Promise<void> {

    const modal = await this.modalController.create({

      component: EducationFormComponent,

      componentProps: {

        education,

      },

    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.refresh) {

      this.loadEducations();

    }

  }

  async deleteEducation(education: Education): Promise<void> {

    const alert = await this.alertController.create({

      header: 'Delete Education',

      message: `Delete <strong>${education.instituteName}</strong>?`,

      buttons: [

        'Cancel',

        {

          text: 'Delete',

          role: 'destructive',

          handler: () => {

            this.educationService.delete(education._id!).subscribe({

              next: async () => {

                const toast = await this.toastController.create({

                  message: 'Education deleted successfully.',

                  color: 'success',

                  duration: 2000,

                });

                await toast.present();

                this.loadEducations();

              }

            });

          }

        }

      ]

    });

    await alert.present();

  }

}