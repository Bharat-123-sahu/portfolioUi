import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  AlertController,
  IonicModule,
  ModalController,
  ToastController,
} from '@ionic/angular';

import { Contact } from '../../models/contact.model';
import { ContactFormComponent } from '../contact-form/contact-form.component';

import { TableColumn } from 'src/app/shared/models/table-column.model';

import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';
import { SearchToolbarComponent } from 'src/app/shared/components/search-toolbar/search-toolbar.component';
import { LoadingComponent } from 'src/app/shared/components/loading/loading.component';
import { EmptyStateComponent } from 'src/app/shared/components/empty-state/empty-state.component';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { ContactService } from '../../services/contact';

@Component({
  selector: 'app-contact-list',
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
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss'],
})
export class ContactListComponent implements OnInit {
  private contactService = inject(ContactService);
  private modalController = inject(ModalController);
  private toastController = inject(ToastController);
  private alertController = inject(AlertController);


  loading = false;

  contacts: Contact[] = [];

  filteredContacts: Contact[] = [];

  paginatedContacts: Contact[] = [];

  currentPage = 1;

  pageSize = 10;

  totalPages = 0;

  columns: TableColumn[] = [
    {
      key: 'profileImage',
      label: 'Profile',
      type: 'image',
    },
    {
      key: 'name',
      label: 'Name',
    },
    {
      key: 'designation',
      label: 'Designation',
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'phone',
      label: 'Phone',
    },
    {
      key: 'availableForHire',
      label: 'Available',
      type: 'badge',
    },
    {
      key: 'isActive',
      label: 'Status',
      type: 'badge',
    },
  ];

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {

    this.loading = true;

    this.contactService.getAll().subscribe({

      next: (response: any) => {

        const contacts =
          response?.data?.contacts ?? response?.contacts ?? response;

        this.contacts = Array.isArray(contacts) ? contacts : [];

        this.filteredContacts = [...this.contacts];

        this.currentPage = 1;

        this.updatePagination();

        this.loading = false;

      },

      error: () => {

        this.loading = false;

      }

    });

  }

  searchContacts(keyword: string): void {

    keyword = keyword.toLowerCase();

    if (!keyword) {

      this.filteredContacts = [...this.contacts];

    } else {

      this.filteredContacts = this.contacts.filter(contact =>

        contact.name.toLowerCase().includes(keyword) ||

        contact.email.toLowerCase().includes(keyword) ||

        contact.phone.toLowerCase().includes(keyword) ||

        contact.designation.toLowerCase().includes(keyword)

      );

    }

    this.currentPage = 1;

    this.updatePagination();

  }

  updatePagination(): void {

    this.totalPages = Math.ceil(
      this.filteredContacts.length / this.pageSize
    );

    const start = (this.currentPage - 1) * this.pageSize;

    this.paginatedContacts = this.filteredContacts.slice(
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

  async addContact(): Promise<void> {

    const modal = await this.modalController.create({

      component: ContactFormComponent,

    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.refresh) {

      this.loadContacts();

    }

  }

  async editContact(contact: Contact): Promise<void> {

    const modal = await this.modalController.create({

      component: ContactFormComponent,

      componentProps: {

        contact,

      },

    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.refresh) {

      this.loadContacts();

    }

  }

  async deleteContact(contact: Contact): Promise<void> {

    const alert = await this.alertController.create({

      header: 'Delete Contact',

      message: `Delete <strong>${contact.name}</strong>?`,

      buttons: [

        'Cancel',

        {

          text: 'Delete',

          role: 'destructive',

          handler: () => {

            this.contactService.delete(contact._id!).subscribe({

              next: async () => {

                const toast = await this.toastController.create({

                  message: 'Contact deleted successfully.',

                  color: 'success',

                  duration: 2000,

                });

                await toast.present();

                this.loadContacts();

              },

            });

          },

        },

      ],

    });

    await alert.present();

  }

}
