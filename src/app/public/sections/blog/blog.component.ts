import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowForwardOutline, newspaperOutline, timeOutline } from 'ionicons/icons';
import { finalize } from 'rxjs';

import { Blog } from 'src/app/features/blog/models/blog.models';
import { PublicService } from '../../public.service';
import { activeOnly, assetUrl, sortByDisplayOrder, unwrapCollection } from '../../public.utils';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  standalone: true,
  imports: [
   
    IonIcon,
    IonSpinner,
    RouterLink,
  ],
})
export class BlogComponent {
  private readonly publicService = inject(PublicService);

  readonly blogs = signal<Blog[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);

  constructor() {
    addIcons({ arrowForwardOutline, newspaperOutline, timeOutline });
    this.loadBlogs();
  }

  imageUrl(blog: Blog): string {
    return assetUrl(blog.featuredImage || blog.gallery?.[0]);
  }

  private loadBlogs(): void {
    this.publicService.getBlogs()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          const blogs = unwrapCollection<Blog>(response, 'blogs')
            .filter((blog) => blog.isPublished !== false);
          this.blogs.set(sortByDisplayOrder(activeOnly(blogs)));
          this.error.set(false);
        },
        error: () => this.error.set(true),
      });
  }
}
