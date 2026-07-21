import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';

import { ImageUploadComponent } from 'src/app/shared/components/image-upload/image-upload.component';
import { GalleryUploadComponent } from 'src/app/shared/components/gallery-upload/gallery-upload.component';
import { TechnologyChipsComponent } from 'src/app/shared/components/technology-chips/technology-chips.component';
import { Blog } from '../../models/blog.models';
import { BlogService } from '../../services/blog';

// Replace with RichTextEditorComponent once created
// import { RichTextEditorComponent } from 'src/app/shared/components/rich-text-editor/rich-text-editor.component';

@Component({
  selector: 'app-blog-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,

    ImageUploadComponent,
    GalleryUploadComponent,
    TechnologyChipsComponent,
    // RichTextEditorComponent
  ],
  templateUrl: './blog-form.component.html',
  styleUrls: ['./blog-form.component.scss'],
})
export class BlogFormComponent implements OnInit {
  @Input() blog?: Blog;

  blogForm!: FormGroup;

  saving = false;

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private modalController: ModalController,
    private toastController: ToastController,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.blogForm = this.fb.group({
      title: [this.blog?.title ?? '', Validators.required],

      slug: [this.blog?.slug ?? '', Validators.required],

      shortDescription: [
        this.blog?.shortDescription ?? '',
        Validators.required,
      ],

      content: [this.blog?.content ?? '', Validators.required],

      featuredImage: [this.blog?.featuredImage ?? ''],

      gallery: [this.blog?.gallery ?? []],

      category: [this.blog?.category ?? '', Validators.required],

      tags: [this.blog?.tags ?? []],

      author: [this.blog?.author ?? ''],

      publishedDate: [this.blog?.publishedDate ?? new Date().toISOString()],

      readingTime: [this.blog?.readingTime ?? 5],

      seoTitle: [this.blog?.seoTitle ?? ''],

      seoDescription: [this.blog?.seoDescription ?? ''],

      displayOrder: [this.blog?.displayOrder ?? 1],

      isFeatured: [this.blog?.isFeatured ?? false],

      isPublished: [this.blog?.isPublished ?? false],

      isActive: [this.blog?.isActive ?? true],
    });
  }

  generateSlug(): void {
    const title = this.blogForm.get('title')?.value;

    if (!title) {
      return;
    }

    this.blogService.generateSlug(title).subscribe({
      next: (response) => {
        this.blogForm.patchValue({
          slug: response.slug,
        });
      },
    });
  }

  submit(): void {
    if (this.blogForm.invalid) {
      this.blogForm.markAllAsTouched();

      return;
    }

    this.saving = true;

    const request = this.blog
      ? this.blogService.update(this.blog._id!, this.blogForm.value)
      : this.blogService.create(this.blogForm.value);

    request.subscribe({
      next: async () => {
        this.saving = false;

        const toast = await this.toastController.create({
          message: this.blog
            ? 'Blog updated successfully.'
            : 'Blog created successfully.',

          duration: 2000,

          color: 'success',
        });

        await toast.present();

        this.modalController.dismiss({
          refresh: true,
        });
      },

      error: async () => {
        this.saving = false;

        const toast = await this.toastController.create({
          message: 'Unable to save blog.',

          duration: 2500,

          color: 'danger',
        });

        await toast.present();
      },
    });
  }

  close(): void {
    this.modalController.dismiss();
  }
}
