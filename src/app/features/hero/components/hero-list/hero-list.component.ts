import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { SearchToolbarComponent } from 'src/app/shared/components/search-toolbar/search-toolbar.component';
import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';
import { EmptyStateComponent } from 'src/app/shared/components/empty-state/empty-state.component';
import { LoadingComponent } from 'src/app/shared/components/loading/loading.component';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import {
  IonicModule,
  ModalController,
  ToastController,
  AlertController,
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import { addOutline, createOutline, trashOutline } from 'ionicons/icons';

import { Hero } from '../../models/hero.model';
import { HeroService } from '../../services/hero.service';
import { HeroFormComponent } from '../hero-form/hero-form.component';

import { environment } from 'src/environments/environment';
import { TableColumn } from 'src/app/shared/models/table-column.model';


@Component({
  selector: 'app-hero-list',
  standalone: true,
  templateUrl: './hero-list.component.html',
  styleUrls: ['./hero-list.component.scss'],
  imports: [CommonModule, IonicModule,SearchToolbarComponent,PageHeaderComponent,EmptyStateComponent,LoadingComponent],
})
export class HeroListComponent implements OnInit {
private heroService = inject(HeroService);
private modalController = inject(ModalController);
private toastController = inject(ToastController);
private alertController = inject(AlertController);


columns: TableColumn[] = [

  {
    key: 'profileImage',
    label: 'Image',
    type: 'image'
  },

  {
    key: 'title',
    label: 'Title'
  },

  {
    key: 'subtitle',
    label: 'Subtitle'
  },

  {
    key: 'isActive',
    label: 'Status',
    type: 'badge'
  }

];

  heroes: Hero[] = [];
  filteredHeroes: Hero[] = [];

  searchTerm = '';
  loading = false;

  currentPage = 1;
pageSize = 5;

paginatedHeroes: Hero[] = [];

totalPages = 0;

  environment = environment;

  constructor() {
    addIcons({
      addOutline,
      createOutline,
      trashOutline,
    });
  }

  ngOnInit(): void {
    this.loadHeroes();
  }

  loadHeroes(): void {
    this.loading = true;

    this.heroService.getAll().subscribe({
      next: (response: any) => {
        this.loading = false;

        const heroes =
          response?.data?.heros ??
          response?.data?.heroes ??
          response?.heros ??
          response?.heroes ??
          response;

        this.heroes = Array.isArray(heroes) ? heroes : [];
        this.filteredHeroes = [...this.heroes];
        this.currentPage = 1;

this.updatePagination();
      },

      error: (error) => {
        this.loading = false;

        console.error(error);
      },
    });
  }

  async addHero() {
    const modal = await this.modalController.create({
      component: HeroFormComponent,

      breakpoints: [0, 0.8, 1],

      initialBreakpoint: 1,
    });

    await modal.present();

    const { role } = await modal.onDidDismiss();

    if (role === 'saved') {
      this.loadHeroes();
    }
    this.currentPage = 1;
this.updatePagination();
  }

  async editHero(hero: Hero) {
    const modal = await this.modalController.create({
      component: HeroFormComponent,

      componentProps: {
        hero,
      },

      breakpoints: [0, 0.8, 1],

      initialBreakpoint: 1,
    });

    await modal.present();

    const { role } = await modal.onDidDismiss();

    if (role === 'saved') {
      this.loadHeroes();
    }
  }

  async deleteHero(hero: Hero) {
    const alert = await this.alertController.create({
      header: 'Delete Hero',

      message: `Are you sure you want to delete <strong>${hero.title}</strong>?`,

      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },

        {
          text: 'Delete',
          role: 'destructive',

          handler: () => {
            this.heroService.delete(hero._id!).subscribe({
              next: async () => {
                const toast = await this.toastController.create({
                  message: 'Hero deleted successfully.',

                  duration: 2000,

                  color: 'success',
                });

                await toast.present();

                this.loadHeroes();
              },

              error: async () => {
                const toast = await this.toastController.create({
                  message: 'Unable to delete Hero.',

                  duration: 2000,

                  color: 'danger',
                });

                await toast.present();
              },
            });
          },
        },
      ],
    });

    await alert.present();
  }

searchHeroes(value: string): void {

  value = value.toLowerCase();

  this.searchTerm = value;

  if (!value) {

    this.filteredHeroes = [...this.heroes];

    this.updatePagination();

    return;

  }

  this.filteredHeroes = this.heroes.filter(hero =>
    hero.title?.toLowerCase().includes(value) ||
    hero.subtitle?.toLowerCase().includes(value)
  );

  this.currentPage = 1;

  this.updatePagination();

}
  updatePagination(): void {

  this.totalPages = Math.ceil(
    this.filteredHeroes.length / this.pageSize
  );

  const start = (this.currentPage - 1) * this.pageSize;

  const end = start + this.pageSize;

  this.paginatedHeroes =
    this.filteredHeroes.slice(start, end);

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
}
