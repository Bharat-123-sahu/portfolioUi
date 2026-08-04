import { DatePipe } from '@angular/common';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  IonButton,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  arrowForwardOutline,
  briefcaseOutline,
  businessOutline,
  calendarOutline,
  copyOutline,
  gridOutline,
  linkOutline,
  locationOutline,
  shareSocialOutline,
  sparklesOutline,
  timeOutline,
} from 'ionicons/icons';
import { catchError, distinctUntilChanged, finalize, forkJoin, map, of, switchMap } from 'rxjs';

import { Experience } from 'src/app/features/experience/models/experience.model';
import { PublicService } from '../../public.service';
import { activeOnly, assetUrl, sortByDisplayOrder, unwrapCollection, unwrapItem } from '../../public.utils';

@Component({
  selector: 'app-experience-detail',
  templateUrl: './experience-detail.component.html',
  styleUrls: ['./experience-detail.component.scss'],
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    IonButton,
    IonIcon,
    IonSpinner,
  ],
})
export class ExperienceDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly publicService = inject(PublicService);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly destroyRef = inject(DestroyRef);

  readonly experience = signal<Experience | null>(null);
  readonly experiences = signal<Experience[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly copied = signal(false);

  readonly related = computed(() => {
    const current = this.experience();
    if (!current) return [];

    return this.experiences()
      .filter((item) => item._id !== current._id)
      .filter((item) =>
        item.employmentType === current.employmentType ||
        item.technologies?.some((tech) => current.technologies?.includes(tech))
      )
      .slice(0, 3);
  });

  readonly previous = computed(() => this.adjacentExperience(-1));
  readonly next = computed(() => this.adjacentExperience(1));

  constructor() {
    addIcons({
      arrowBackOutline,
      arrowForwardOutline,
      briefcaseOutline,
      businessOutline,
      calendarOutline,
      copyOutline,
      gridOutline,
      linkOutline,
      locationOutline,
      shareSocialOutline,
      sparklesOutline,
      timeOutline,
    });

    this.route.paramMap.pipe(
      map((params) => params.get('id') ?? ''),
      distinctUntilChanged(),
      switchMap((id) => {
        this.loading.set(true);
        this.error.set(false);
        this.experience.set(null);

        return forkJoin({
          detail: this.publicService.getExperienceById(id),
          experiences: this.publicService.getExperience().pipe(catchError(() => of([]))),
        }).pipe(finalize(() => this.loading.set(false)));
      }),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: ({ detail, experiences }) => {
        const experience = unwrapItem<Experience>(detail, 'experience');
        const allExperiences = sortByDisplayOrder(
          activeOnly(unwrapCollection<Experience>(experiences, 'experiences'))
        );

        if (!experience || experience.isActive === false) {
          this.error.set(true);
          return;
        }

        this.experience.set(experience);
        this.experiences.set(allExperiences);
        this.updateSeo(experience);
      },
      error: () => this.error.set(true),
    });
  }

  logoUrl(item: Experience): string {
    return assetUrl(item.companyLogo);
  }

  period(item: Experience): string {
    const start = item.startDate ? new Date(item.startDate).getFullYear() : '';
    const end = item.currentlyWorking
      ? 'Present'
      : item.endDate
        ? new Date(item.endDate).getFullYear()
        : '';

    return [start, end].filter(Boolean).join(' - ');
  }

  share(): void {
    const item = this.experience();
    if (!item) return;

    const url = this.currentUrl();
    const payload = {
      title: `${item.designation} at ${item.companyName}`,
      text: item.description,
      url,
    };

    if (navigator.share) {
      void navigator.share(payload);
      return;
    }

    void navigator.clipboard?.writeText(url);
    this.flashCopied();
  }

  copyLink(): void {
    void navigator.clipboard?.writeText(this.currentUrl());
    this.flashCopied();
  }

  private adjacentExperience(offset: -1 | 1): Experience | null {
    const current = this.experience();
    const experiences = this.experiences();
    if (!current || !experiences.length) return null;

    const index = experiences.findIndex((item) => item._id === current._id);
    const adjacentIndex = index + offset;

    return adjacentIndex >= 0 && adjacentIndex < experiences.length
      ? experiences[adjacentIndex]
      : null;
  }

  private currentUrl(): string {
    return typeof window === 'undefined' ? '' : window.location.href;
  }

  private flashCopied(): void {
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1800);
  }

  private updateSeo(item: Experience): void {
    const title = `${item.designation} at ${item.companyName} | Experience`;
    const description = item.description || `${item.employmentType} role based in ${item.location}.`;
    const image = this.logoUrl(item);

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: 'article' });
    if (image) this.meta.updateTag({ property: 'og:image', content: image });
  }
}
