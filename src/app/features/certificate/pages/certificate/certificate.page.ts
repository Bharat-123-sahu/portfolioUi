import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CertificateListComponent } from '../../components/certificate-list/certificate-list.component';


@Component({
  selector: 'app-certificate-page',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    CertificateListComponent,
  ],
  templateUrl: './certificate.page.html',
  styleUrls: ['./certificate.page.scss'],
})
export class CertificatePage {}