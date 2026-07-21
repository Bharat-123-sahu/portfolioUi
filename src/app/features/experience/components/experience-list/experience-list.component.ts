import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  IonicModule,
  ModalController,
  ToastController,
} from '@ionic/angular';

import { Experience } from '../../models/experience.model';
// import { ExperienceService } from '../../services/experience.service';
import { ExperienceFormComponent } from '../experience-form/experience-form.component';

import { TableColumn } from 'src/app/shared/models/table-column.model';

import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';
import { SearchToolbarComponent } from 'src/app/shared/components/search-toolbar/search-toolbar.component';
import { LoadingComponent } from 'src/app/shared/components/loading/loading.component';
import { EmptyStateComponent } from 'src/app/shared/components/empty-state/empty-state.component';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { ExperienceService } from '../../services/experience';

@Component({
  selector: 'app-experience-list',
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
  templateUrl: './experience-list.component.html',
  styleUrls: ['./experience-list.component.scss'],
})
export class ExperienceListComponent implements OnInit {

  loading = false;

  experiences: Experience[] = [];

  filteredExperiences: Experience[] = [];

  paginatedExperiences: Experience[] = [];

  currentPage = 1;

  pageSize = 10;

  totalPages = 0;

  columns: TableColumn[] = [
    {
      key: 'companyLogo',
      label: 'Logo',
      type: 'image',
    },
    {
      key: 'companyName',
      label: 'Company',
    },
    {
      key: 'designation',
      label: 'Designation',
    },
    {
      key: 'employmentType',
      label: 'Employment',
    },
    {
      key: 'location',
      label: 'Location',
    },
    {
      key: 'currentlyWorking',
      label: 'Current',
      type: 'badge',
    },
    {
      key: 'isActive',
      label: 'Status',
      type: 'badge',
    },
  ];

  constructor(
    private experienceService: ExperienceService,
    private modalController: ModalController,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.loadExperiences();
  }

  loadExperiences(): void {

    this.loading = true;

    this.experienceService.getAll().subscribe({

      next: (response: any) => {

        this.experiences = response.experiences ?? response;

        this.filteredExperiences = [...this.experiences];

        this.currentPage = 1;

        this.updatePagination();

        this.loading = false;

      },

      error: () => {

        this.loading = false;

      }

    });

  }

  searchExperiences(keyword: string): void {

    keyword = keyword.toLowerCase();

    if (!keyword) {

      this.filteredExperiences = [...this.experiences];

    } else {

      this.filteredExperiences = this.experiences.filter(exp =>

        exp.companyName.toLowerCase().includes(keyword) ||

        exp.designation.toLowerCase().includes(keyword) ||

        exp.location.toLowerCase().includes(keyword)

      );

    }

    this.currentPage = 1;

    this.updatePagination();

  }

  updatePagination(): void {

    this.totalPages = Math.ceil(
      this.filteredExperiences.length / this.pageSize
    );

    const start = (this.currentPage - 1) * this.pageSize;

    this.paginatedExperiences = this.filteredExperiences.slice(
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

  async addExperience(): Promise<void> {

    const modal = await this.modalController.create({

      component: ExperienceFormComponent,

    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.refresh) {

      this.loadExperiences();

    }

  }

  async editExperience(experience: Experience): Promise<void> {

    const modal = await this.modalController.create({

      component: ExperienceFormComponent,

      componentProps: {

        experience,

      },

    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.refresh) {

      this.loadExperiences();

    }

  }

  async deleteExperience(experience: Experience): Promise<void> {

    const alert = await this.alertController.create({

      header: 'Delete Experience',

      message: `Delete <strong>${experience.companyName}</strong>?`,

      buttons: [

        'Cancel',

        {

          text: 'Delete',

          role: 'destructive',

          handler: () => {

            this.experienceService.delete(experience._id!).subscribe({

              next: async () => {

                const toast = await this.toastController.create({

                  message: 'Experience deleted successfully.',

                  duration: 2000,

                  color: 'success',

                });

                await toast.present();

                this.loadExperiences();

              }

            });

          }

        }

      ]

    });

    await alert.present();

  }

}