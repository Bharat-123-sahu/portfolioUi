import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { EducationListComponent } from '../../components/education-list/education-list.component';


@Component({
  selector: 'app-education-page',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    EducationListComponent,
  ],
  templateUrl: './education.page.html',
  styleUrls: ['./education.page.scss'],
})
export class EducationPage {}