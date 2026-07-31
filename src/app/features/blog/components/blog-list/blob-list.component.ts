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
import { Blog } from '../../models/blog.models';
import { BlogService } from '../../services/blog';
import { BlogFormComponent } from '../blog-form/blob-form.component';

@Component({
  selector: 'app-blog-list',
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
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss'],
})
export class BlogListComponent implements OnInit {
  private blogService = inject(BlogService);
  private modalController = inject(ModalController);
  private toastController = inject(ToastController);
  private alertController = inject(AlertController);

  loading = false;

  blogs: Blog[] = [];

  filteredBlogs: Blog[] = [];

  paginatedBlogs: Blog[] = [];

  currentPage = 1;

  pageSize = 10;

  totalPages = 0;

  columns: TableColumn[] = [
    {
      key: 'featuredImage',
      label: 'Image',
      type: 'image',
    },
    {
      key: 'title',
      label: 'Title',
    },
    {
      key: 'category',
      label: 'Category',
    },
    {
      key: 'author',
      label: 'Author',
    },
    {
      key: 'publishedDate',
      label: 'Published',
      type: 'date',
    },
    {
      key: 'isFeatured',
      label: 'Featured',
      type: 'badge',
    },
    {
      key: 'isPublished',
      label: 'Published',
      type: 'badge',
    },
    {
      key: 'isActive',
      label: 'Status',
      type: 'badge',
    },
  ];

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.loading = true;

    this.blogService.getAll().subscribe({
      next: (response: any) => {
        const blogs = response?.data?.blogs ?? response?.blogs ?? response;

        this.blogs = Array.isArray(blogs) ? blogs : [];

        this.filteredBlogs = [...this.blogs];

        this.currentPage = 1;

        this.updatePagination();

        this.loading = false;
      },

      error: () => {
        this.loading = false;
      },
    });
  }

  searchBlogs(keyword: string): void {
    keyword = keyword.toLowerCase();

    if (!keyword) {
      this.filteredBlogs = [...this.blogs];
    } else {
      this.filteredBlogs = this.blogs.filter(
        (blog) =>
          blog.title.toLowerCase().includes(keyword) ||
          blog.category.toLowerCase().includes(keyword) ||
          blog.author.toLowerCase().includes(keyword),
      );
    }

    this.currentPage = 1;

    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredBlogs.length / this.pageSize);

    const start = (this.currentPage - 1) * this.pageSize;

    this.paginatedBlogs = this.filteredBlogs.slice(
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

  async addBlog(): Promise<void> {
    const modal = await this.modalController.create({
      component: BlogFormComponent,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.refresh) {
      this.loadBlogs();
    }
  }

  async editBlog(blog: Blog): Promise<void> {
    const modal = await this.modalController.create({
      component: BlogFormComponent,

      componentProps: {
        blog,
      },
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.refresh) {
      this.loadBlogs();
    }
  }

  async deleteBlog(blog: Blog): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Delete Blog',

      message: `Delete <strong>${blog.title}</strong>?`,

      buttons: [
        'Cancel',

        {
          text: 'Delete',

          role: 'destructive',

          handler: () => {
            this.blogService.delete(blog._id!).subscribe({
              next: async () => {
                const toast = await this.toastController.create({
                  message: 'Blog deleted successfully.',

                  color: 'success',

                  duration: 2000,
                });

                await toast.present();

                this.loadBlogs();
              },
            });
          },
        },
      ],
    });

    await alert.present();
  }
}
