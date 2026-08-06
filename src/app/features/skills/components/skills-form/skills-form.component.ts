import { CommonModule } from '@angular/common';
import { Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  IonicModule,
  ModalController,
  ToastController,
} from '@ionic/angular';


import { ImageUploadComponent } from 'src/app/shared/components/image-upload/image-upload.component';
import { Skill } from '../../models/skills.model';
import { SkillsService } from '../../services/skills';

@Component({
  selector: 'app-skill-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    ImageUploadComponent,
  ],
  templateUrl: './skills-form.component.html',
  styleUrls: ['./skills-form.component.scss'],
})
export class SkillFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private skillService = inject(SkillsService);
  private modalController = inject(ModalController);
  private toastController = inject(ToastController);
  private destroyRef = inject(DestroyRef);


  @Input() skill?: Skill;

  skillForm!: FormGroup;

  saving = false;

  categories = [
    'Frontend',
    'Backend',
    'Database',
    'Mobile',
    'DevOps',
    'Cloud',
    'Tools',
    'Programming Language',
    'Testing',
    'Others'
  ];

  ngOnInit(): void {
    this.initializeForm();

    this.skillForm
      .get('name')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {

        if (!this.skill) {

          this.skillForm.patchValue(
            {
              slug: this.generateSlug(value),
            },
            {
              emitEvent: false,
            }
          );

        }

      });

  }

  initializeForm(): void {

    this.skillForm = this.fb.group({

      name: [
        this.skill?.name ?? '',
        Validators.required,
      ],

      slug: [
        this.skill?.slug ?? '',
        Validators.required,
      ],

      category: [
        this.skill?.category ?? '',
        Validators.required,
      ],

      icon: [
        this.skill?.icon ?? '',
      ],

      percentage: [
        this.skill?.percentage ?? 80,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(100),
        ],
      ],

      displayOrder: [
        this.skill?.displayOrder ?? 1,
      ],

      isFeatured: [
        this.skill?.isFeatured ?? false,
      ],

      isActive: [
        this.skill?.isActive ?? true,
      ],

    });

  }

  private generateSlug(value: string): string {

    return value
      ?.toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

  }

  submit(): void {

    if (this.skillForm.invalid) {

      this.skillForm.markAllAsTouched();

      return;

    }

    this.saving = true;

    const request = this.skill
      ? this.skillService.update(
          this.skill._id!,
          this.skillForm.value
        )
      : this.skillService.create(
          this.skillForm.value
        );

    request.subscribe({

      next: async () => {

        this.saving = false;

        const toast = await this.toastController.create({

          message: this.skill
            ? 'Skill updated successfully.'
            : 'Skill created successfully.',

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

          message: 'Unable to save skill.',

          duration: 2000,

          color: 'danger',

        });

        await toast.present();

      }

    });

  }

  close(): void {

    this.modalController.dismiss();

  }

}
