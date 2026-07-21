import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AboutListComponent } from '../../components/about-list/about-list.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    IonicModule,
    AboutListComponent
  ],
  templateUrl: './about.page.html'
})
export class AboutPage {}