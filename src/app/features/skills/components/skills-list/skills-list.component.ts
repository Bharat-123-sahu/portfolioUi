import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  AlertController,
  IonicModule,
  ModalController,
  ToastController,
} from '@ionic/angular';


import { TableColumn } from 'src/app/shared/models/table-column.model';

import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';
import { SearchToolbarComponent } from 'src/app/shared/components/search-toolbar/search-toolbar.component';
import { LoadingComponent } from 'src/app/shared/components/loading/loading.component';
import { EmptyStateComponent } from 'src/app/shared/components/empty-state/empty-state.component';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { Skill } from '../../models/skills.model';
import { SkillsService } from '../../services/skills';
import { SkillFormComponent } from '../skills-form/skills-form.component';

@Component({
  selector: 'app-skill-list',
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
  templateUrl: './skills-list.component.html',
  styleUrls: ['./skills-list.component.scss'],
})
export class SkillListComponent implements OnInit {
  private skillService = inject(SkillsService);
  private modalController = inject(ModalController);
  private toastController = inject(ToastController);
  private alertController = inject(AlertController);


  loading = false;

  skills: Skill[] = [];

  filteredSkills: Skill[] = [];

  paginatedSkills: Skill[] = [];

  currentPage = 1;

  pageSize = 10;

  totalPages = 0;

  columns: TableColumn[] = [
    {
      key: 'icon',
      label: 'Icon',
      type: 'image',
    },
    {
      key: 'name',
      label: 'Skill',
    },
    {
      key: 'category',
      label: 'Category',
    },
    {
      key: 'percentage',
      label: 'Level (%)',
    },
    {
      key: 'displayOrder',
      label: 'Order',
    },
    {
      key: 'isFeatured',
      label: 'Featured',
      type: 'badge',
    },
    {
      key: 'isActive',
      label: 'Status',
      type: 'badge',
    },
  ];

  ngOnInit(): void {
    this.loadSkills();
  }

  loadSkills(): void {

    this.loading = true;

    this.skillService.getAll().subscribe({

      next: (response: any) => {

        const skills = response?.data?.skills ?? response?.skills ?? response;

        this.skills = Array.isArray(skills) ? skills : [];

        this.filteredSkills = [...this.skills];

        this.currentPage = 1;

        this.updatePagination();

        this.loading = false;

      },

      error: () => {

        this.loading = false;

      }

    });

  }

  searchSkills(keyword: string): void {

    keyword = keyword.toLowerCase();

    if (!keyword) {

      this.filteredSkills = [...this.skills];

    } else {

      this.filteredSkills = this.skills.filter(skill =>

        skill.name.toLowerCase().includes(keyword) ||

        skill.category.toLowerCase().includes(keyword)

      );

    }

    this.currentPage = 1;

    this.updatePagination();

  }

  updatePagination(): void {

    this.totalPages = Math.ceil(
      this.filteredSkills.length / this.pageSize
    );

    const start = (this.currentPage - 1) * this.pageSize;

    this.paginatedSkills = this.filteredSkills.slice(
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

  async addSkill(): Promise<void> {

    const modal = await this.modalController.create({

      component: SkillFormComponent,

    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.refresh) {

      this.loadSkills();

    }

  }

  async editSkill(skill: Skill): Promise<void> {

    const modal = await this.modalController.create({

      component: SkillFormComponent,

      componentProps: {

        skill,

      },

    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.refresh) {

      this.loadSkills();

    }

  }

  async deleteSkill(skill: Skill): Promise<void> {

    const alert = await this.alertController.create({

      header: 'Delete Skill',

      message: `Delete <strong>${skill.name}</strong>?`,

      buttons: [

        'Cancel',

        {

          text: 'Delete',

          role: 'destructive',

          handler: () => {

            this.skillService.delete(skill._id!).subscribe({

              next: async () => {

                const toast = await this.toastController.create({

                  message: 'Skill deleted successfully.',

                  duration: 2000,

                  color: 'success',

                });

                await toast.present();

                this.loadSkills();

              }

            });

          }

        }

      ]

    });

    await alert.present();

  }

}
