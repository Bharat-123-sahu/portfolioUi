import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ResumeListComponent } from '../../components/resume-list/resume-list.component';


@Component({
  selector: 'app-resume-page',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ResumeListComponent,
  ],
  templateUrl: './resume.page.html',
  styleUrls: ['./resume.page.scss'],
})
export class ResumePage {}