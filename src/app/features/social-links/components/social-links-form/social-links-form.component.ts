import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';

import { SocialLink } from '../../models/social-link.model';
import { SocialLinkService } from '../../services/social-links';

@Component({
  selector: 'app-social-link-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule],
  templateUrl: './social-links-form.component.html',
  styleUrls: ['./social-links-form.component.scss'],
})
export class SocialLinkFormComponent implements OnInit {
  SOCIAL_PLATFORMS = [
    {
      value: 'linkedin',
      label: 'LinkedIn',
      icon: 'logo-linkedin',
      color: '#0A66C2',
    },

    {
      value: 'github',
      label: 'GitHub',
      icon: 'logo-github',
      color: '#24292E',
    },

    {
      value: 'x',
      label: 'X (Twitter)',
      icon: 'logo-twitter',
      color: '#000000',
    },

    {
      value: 'instagram',
      label: 'Instagram',
      icon: 'logo-instagram',
      color: '#E1306C',
    },

    {
      value: 'facebook',
      label: 'Facebook',
      icon: 'logo-facebook',
      color: '#1877F2',
    },

    {
      value: 'youtube',
      label: 'YouTube',
      icon: 'logo-youtube',
      color: '#FF0000',
    },

    {
      value: 'leetcode',
      label: 'LeetCode',
      icon: 'code-slash',
      color: '#FFA116',
    },

    {
      value: 'hackerrank',
      label: 'HackerRank',
      icon: 'terminal',
      color: '#00EA64',
    },

    {
      value: 'stackoverflow',
      label: 'Stack Overflow',
      icon: 'layers',
      color: '#F48024',
    },

    {
      value: 'medium',
      label: 'Medium',
      icon: 'book',
      color: '#000000',
    },

    {
      value: 'devto',
      label: 'Dev.to',
      icon: 'logo-dev',
      color: '#0A0A0A',
    },

    {
      value: 'portfolio',
      label: 'Portfolio',
      icon: 'globe',
      color: '#3880FF',
    },
  ];

  @Input() socialLink?: SocialLink;

  form!: FormGroup;

  saving = false;

  platforms = this.SOCIAL_PLATFORMS;

  constructor(
    private fb: FormBuilder,
    private socialLinkService: SocialLinkService,
    private modalController: ModalController,
    private toastController: ToastController,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.form = this.fb.group({
      platform: [this.socialLink?.platform ?? '', Validators.required],

      username: [this.socialLink?.username ?? '', Validators.required],

      url: [
        this.socialLink?.url ?? '',
        [Validators.required, Validators.pattern(/^https?:\/\/.+/)],
      ],

      icon: [this.socialLink?.icon ?? ''],

      color: [this.socialLink?.color ?? ''],

      displayOrder: [this.socialLink?.displayOrder ?? 1],

      isVisible: [this.socialLink?.isVisible ?? true],

      isActive: [this.socialLink?.isActive ?? true],
    });

    if (!this.socialLink) {
      this.form.get('platform')?.valueChanges.subscribe((platform) => {
        this.updatePlatform(platform);
      });
    }
  }

  updatePlatform(platform: string): void {
    const selected = this.platforms.find(
      (item: { value: string }) => item.value === platform,
    );

    if (!selected) {
      return;
    }

    this.form.patchValue({
      icon: selected.icon,

      color: selected.color,
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    this.saving = true;

    const request = this.socialLink
      ? this.socialLinkService.update(
          this.socialLink._id!,

          this.form.value,
        )
      : this.socialLinkService.create(this.form.value);

    request.subscribe({
      next: async () => {
        this.saving = false;

        const toast = await this.toastController.create({
          message: this.socialLink
            ? 'Social link updated successfully.'
            : 'Social link created successfully.',

          color: 'success',

          duration: 2000,
        });

        await toast.present();

        this.modalController.dismiss({
          refresh: true,
        });
      },

      error: async () => {
        this.saving = false;

        const toast = await this.toastController.create({
          message: 'Unable to save social link.',

          color: 'danger',

          duration: 2500,
        });

        await toast.present();
      },
    });
  }

  close(): void {
    this.modalController.dismiss();
  }
}
