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
  bookOutline,
  calendarOutline,
  copyOutline,
  gridOutline,
  linkOutline,
  newspaperOutline,
  personOutline,
  shareSocialOutline,
  timeOutline,
} from 'ionicons/icons';
import { catchError, distinctUntilChanged, finalize, forkJoin, map, of, switchMap } from 'rxjs';

import { Blog } from 'src/app/features/blog/models/blog.models';
import { PublicService } from '../../public.service';
import { activeOnly, assetUrl, sortByDisplayOrder, unwrapCollection, unwrapItem } from '../../public.utils';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss'],
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    IonButton,
    IonIcon,
    IonSpinner,
  ],
})
export class BlogDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly publicService = inject(PublicService);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly destroyRef = inject(DestroyRef);

  readonly blog = signal<Blog | null>(null);
  readonly blogs = signal<Blog[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly copied = signal(false);

  readonly gallery = computed(() => {
    const blog = this.blog();
    if (!blog) return [];

    return [...new Set([blog.featuredImage, ...(blog.gallery ?? [])].filter(Boolean))]
      .map((image) => assetUrl(image));
  });

  readonly related = computed(() => {
    const current = this.blog();
    if (!current) return [];

    return this.blogs()
      .filter((blog) => blog.slug !== current.slug)
      .filter((blog) =>
        blog.category === current.category ||
        blog.tags?.some((tag) => current.tags?.includes(tag))
      )
      .slice(0, 3);
  });

  readonly previous = computed(() => this.adjacentBlog(-1));
  readonly next = computed(() => this.adjacentBlog(1));

  constructor() {
    addIcons({
      arrowBackOutline,
      arrowForwardOutline,
      bookOutline,
      calendarOutline,
      copyOutline,
      gridOutline,
      linkOutline,
      newspaperOutline,
      personOutline,
      shareSocialOutline,
      timeOutline,
    });

    this.route.paramMap.pipe(
      map((params) => params.get('slug') ?? ''),
      distinctUntilChanged(),
      switchMap((slug) => {
        this.loading.set(true);
        this.error.set(false);
        this.blog.set(null);

        return forkJoin({
          detail: this.publicService.getBlogBySlug(slug),
          blogs: this.publicService.getBlogs().pipe(catchError(() => of([]))),
        }).pipe(finalize(() => this.loading.set(false)));
      }),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: ({ detail, blogs }) => {
        const blog = unwrapItem<Blog>(detail, 'blog');
        const allBlogs = sortByDisplayOrder(
          activeOnly(unwrapCollection<Blog>(blogs, 'blogs').filter((item) => item.isPublished !== false))
        );

        if (!blog) {
          this.error.set(true);
          return;
        }

        this.blog.set(blog);
        this.blogs.set(allBlogs);
        this.updateSeo(blog);
      },
      error: () => this.error.set(true),
    });
  }

  imageUrl(path?: string): string {
    return assetUrl(path);
  }

  blogImage(blog: Blog): string {
    return assetUrl(blog.featuredImage || blog.gallery?.[0]);
  }

  share(): void {
    const blog = this.blog();
    if (!blog) return;

    const url = this.currentUrl();
    const payload = {
      title: blog.title,
      text: blog.shortDescription,
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

  private adjacentBlog(offset: -1 | 1): Blog | null {
    const current = this.blog();
    const blogs = this.blogs();
    if (!current || !blogs.length) return null;

    const index = blogs.findIndex((blog) => blog.slug === current.slug);
    const adjacentIndex = index + offset;

    return adjacentIndex >= 0 && adjacentIndex < blogs.length ? blogs[adjacentIndex] : null;
  }

  private currentUrl(): string {
    return typeof window === 'undefined' ? '' : window.location.href;
  }

  private flashCopied(): void {
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1800);
  }

  private updateSeo(blog: Blog): void {
    const title = blog.seoTitle || `${blog.title} | Blog`;
    const description = blog.seoDescription || blog.shortDescription || 'Portfolio blog article.';
    const image = this.blogImage(blog);

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: 'article' });
    if (image) this.meta.updateTag({ property: 'og:image', content: image });
  }
}
