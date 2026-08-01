import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  IonButton,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { downloadOutline, ribbonOutline } from 'ionicons/icons';
import { finalize } from 'rxjs';

import { Certificate } from 'src/app/features/certificate/models/certificate.models';
import { PublicService } from '../../public.service';
import { activeOnly, assetUrl, sortByDisplayOrder, unwrapCollection } from '../../public.utils';

@Component({
  selector: 'app-certificates',
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.scss'],
  standalone: true,
  imports: [
    DatePipe,
    IonButton,
    IonIcon,
    IonSpinner,
  ],
})
export class CertificatesComponent {
  private readonly publicService = inject(PublicService);

  readonly certificates = signal<Certificate[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);

  constructor() {
    addIcons({ downloadOutline, ribbonOutline });
    this.loadCertificates();
  }

  imageUrl(item: Certificate): string {
    return assetUrl(item.certificateImage);
  }

  open(url?: string): void {
    if (url) window.open(assetUrl(url), '_blank', 'noopener,noreferrer');
  }

  private loadCertificates(): void {
    this.publicService.getCertificates()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          this.certificates.set(sortByDisplayOrder(activeOnly(unwrapCollection<Certificate>(response, 'certificates'))));
          this.error.set(false);
        },
        error: () => this.error.set(true),
      });
  }
}
