import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';

import { ProjectFormComponent } from '../project-form/project-form.component';

import { TableColumn } from 'src/app/shared/models/table-column.model';

import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';
import { SearchToolbarComponent } from 'src/app/shared/components/search-toolbar/search-toolbar.component';
import { LoadingComponent } from 'src/app/shared/components/loading/loading.component';
import { EmptyStateComponent } from 'src/app/shared/components/empty-state/empty-state.component';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { UiFeedbackService } from 'src/app/shared/services/ui-feedback.service';
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
  private projectService = inject(ProjectService);
  private modalController = inject(ModalController);
  private uiFeedback = inject(UiFeedbackService);

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

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;

    this.projectService.getAll().subscribe({
      next: (response: any) => {
        const projects =
          response?.data?.projects ?? response?.projects ?? response;

        this.projects = Array.isArray(projects) ? projects : [];

        this.filteredProjects = [...this.projects];

        this.currentPage = 1;

        this.updatePagination();

        this.loading = false;
      },

      error: async () => {
        this.loading = false;
        await this.uiFeedback.error(
          'Unable to load projects. Please try again.',
        );
      },
    });
  }

  searchProjects(keyword: string): void {
    keyword = keyword.toLowerCase();

    if (!keyword) {
      this.filteredProjects = [...this.projects];
    } else {
      this.filteredProjects = this.projects.filter(
        (project) =>
          project.title.toLowerCase().includes(keyword) ||
          project.category.toLowerCase().includes(keyword) ||
          project.shortDescription.toLowerCase().includes(keyword),
      );
    }

    this.currentPage = 1;

    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredProjects.length / this.pageSize);

    const start = (this.currentPage - 1) * this.pageSize;

    this.paginatedProjects = this.filteredProjects.slice(
      start,
      start + this.pageSize,
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
    const confirmed = await this.uiFeedback.confirmDelete(
      project.title,
      'Project',
    );

    if (!confirmed) {
      return;
    }

    this.projectService.delete(project._id!).subscribe({
      next: async () => {
        await this.uiFeedback.success('Project deleted successfully.');
        this.loadProjects();
      },
      error: async () => {
        await this.uiFeedback.error(
          'Unable to delete project. Please try again.',
        );
      },
    });
  }
}
