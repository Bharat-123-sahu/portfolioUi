import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  IonicModule,
  ModalController,
  ToastController,
} from '@ionic/angular';


import { ProjectFormComponent } from '../project-form/project-form.component';

import { TableColumn } from 'src/app/shared/models/table-column.model';

import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';
import { SearchToolbarComponent } from 'src/app/shared/components/search-toolbar/search-toolbar.component';
import { LoadingComponent } from 'src/app/shared/components/loading/loading.component';
import { EmptyStateComponent } from 'src/app/shared/components/empty-state/empty-state.component';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { Project } from '../../models/project.models';
import { ProjectService } from '../../services/projects';

@Component({
  selector: 'app-project-list',
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
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss'],
})
export class ProjectListComponent implements OnInit {

  loading = false;

  projects: Project[] = [];

  filteredProjects: Project[] = [];

  paginatedProjects: Project[] = [];

  currentPage = 1;

  pageSize = 10;

  totalPages = 0;

  columns: TableColumn[] = [
    {
      key: 'thumbnail',
      label: 'Thumbnail',
      type: 'image',
    },
    {
      key: 'title',
      label: 'Project',
    },
    {
      key: 'category',
      label: 'Category',
      type: 'badge',
    },
    {
      key: 'technologies',
      label: 'Technologies',
    },
    {
      key: 'isFeatured',
      label: 'Featured',
      type: 'badge',
    },
    {
      key: 'displayOrder',
      label: 'Order',
    },
    {
      key: 'isActive',
      label: 'Status',
      type: 'badge',
    },
  ];

  constructor(
    private projectService: ProjectService,
    private modalController: ModalController,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {

    this.loading = true;

    this.projectService.getAll().subscribe({

      next: (response: any) => {

        this.projects = response.data ?? response;

        this.filteredProjects = [...this.projects];

        this.currentPage = 1;

        this.updatePagination();

        this.loading = false;

      },

      error: () => {

        this.loading = false;

      }

    });

  }

  searchProjects(keyword: string): void {

    keyword = keyword.toLowerCase();

    if (!keyword) {

      this.filteredProjects = [...this.projects];

    } else {

      this.filteredProjects = this.projects.filter(project =>

        project.title.toLowerCase().includes(keyword) ||

        project.category.toLowerCase().includes(keyword) ||

        project.shortDescription.toLowerCase().includes(keyword)

      );

    }

    this.currentPage = 1;

    this.updatePagination();

  }

  updatePagination(): void {

    this.totalPages = Math.ceil(
      this.filteredProjects.length / this.pageSize
    );

    const start = (this.currentPage - 1) * this.pageSize;

    this.paginatedProjects = this.filteredProjects.slice(
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

  async addProject(): Promise<void> {

    const modal = await this.modalController.create({

      component: ProjectFormComponent,

    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.refresh) {

      this.loadProjects();

    }

  }

  async editProject(project: Project): Promise<void> {

    const modal = await this.modalController.create({

      component: ProjectFormComponent,

      componentProps: {

        project,

      },

    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.refresh) {

      this.loadProjects();

    }

  }

  async deleteProject(project: Project): Promise<void> {

    const alert = await this.alertController.create({

      header: 'Delete Project',

      message: `Delete <strong>${project.title}</strong>?`,

      buttons: [

        'Cancel',

        {

          text: 'Delete',

          role: 'destructive',

          handler: () => {

            this.projectService.delete(project._id!).subscribe({

              next: async () => {

                const toast = await this.toastController.create({

                  message: 'Project deleted successfully.',

                  duration: 2000,

                  color: 'success',

                });

                await toast.present();

                this.loadProjects();

              }

            });

          }

        }

      ]

    });

    await alert.present();

  }

}