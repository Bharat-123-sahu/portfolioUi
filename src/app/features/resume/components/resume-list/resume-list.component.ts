import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  IonicModule,
  ModalController,
  ToastController,
} from '@ionic/angular';

import { ResumeFormComponent } from '../resume-form/resume-form.component';

import { TableColumn } from 'src/app/shared/models/table-column.model';

import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';
import { SearchToolbarComponent } from 'src/app/shared/components/search-toolbar/search-toolbar.component';
import { LoadingComponent } from 'src/app/shared/components/loading/loading.component';
import { EmptyStateComponent } from 'src/app/shared/components/empty-state/empty-state.component';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { Resume } from '../../models/resume.models';
import { ResumeService } from '../../services/resume';

@Component({
  selector: 'app-resume-list',
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
  templateUrl: './resume-list.component.html',
  styleUrls: ['./resume-list.component.scss'],
})
export class ResumeListComponent implements OnInit {

  loading = false;

  resumes: Resume[] = [];

  filteredResumes: Resume[] = [];

  paginatedResumes: Resume[] = [];

  currentPage = 1;

  pageSize = 10;

  totalPages = 0;

  columns: TableColumn[] = [
    {
      key: 'title',
      label: 'Title',
    },
    {
      key: 'version',
      label: 'Version',
    },
    {
      key: 'resumeFile',
      label: 'Resume',
      type: 'file',
    },
    {
      key: 'isDefault',
      label: 'Default',
      type: 'badge',
    },
    {
      key: 'isActive',
      label: 'Status',
      type: 'badge',
    },
  ];

  constructor(
    private resumeService: ResumeService,
    private modalController: ModalController,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.loadResumes();
  }

  loadResumes(): void {

    this.loading = true;

    this.resumeService.getAll().subscribe({

      next: (response: any) => {

        this.resumes = response.data ?? response;

        this.filteredResumes = [...this.resumes];

        this.currentPage = 1;

        this.updatePagination();

        this.loading = false;

      },

      error: () => {

        this.loading = false;

      }

    });

  }

  searchResumes(keyword: string): void {

    keyword = keyword.toLowerCase();

    if (!keyword) {

      this.filteredResumes = [...this.resumes];

    } else {

      this.filteredResumes = this.resumes.filter(item =>

        item.title.toLowerCase().includes(keyword) ||

        item.version.toLowerCase().includes(keyword)

      );

    }

    this.currentPage = 1;

    this.updatePagination();

  }

  updatePagination(): void {

    this.totalPages = Math.ceil(
      this.filteredResumes.length / this.pageSize
    );

    const start = (this.currentPage - 1) * this.pageSize;

    this.paginatedResumes = this.filteredResumes.slice(
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

  async addResume(): Promise<void> {

    const modal = await this.modalController.create({

      component: ResumeFormComponent,

    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.refresh) {

      this.loadResumes();

    }

  }

  async editResume(resume: Resume): Promise<void> {

    const modal = await this.modalController.create({

      component: ResumeFormComponent,

      componentProps: {

        resume,

      },

    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.refresh) {

      this.loadResumes();

    }

  }

  async deleteResume(resume: Resume): Promise<void> {

    const alert = await this.alertController.create({

      header: 'Delete Resume',

      message: `Delete <strong>${resume.title}</strong>?`,

      buttons: [

        'Cancel',

        {

          text: 'Delete',

          role: 'destructive',

          handler: () => {

            this.resumeService.delete(resume._id!).subscribe({

              next: async () => {

                const toast = await this.toastController.create({

                  message: 'Resume deleted successfully.',

                  color: 'success',

                  duration: 2000,

                });

                await toast.present();

                this.loadResumes();

              }

            });

          }

        }

      ]

    });

    await alert.present();

  }

}