import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ExperienceListComponent } from '../../components/experience-list/experience-list.component';


@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [
    IonicModule,
    ExperienceListComponent,
  ],
  templateUrl: './experience.page.html',
  styleUrls: ['./experience.page.scss'],
})
export class ExperiencePage {}