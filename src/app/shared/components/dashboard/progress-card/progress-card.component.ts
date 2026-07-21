import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { WidgetContainerComponent } from '../widget-container/widget-container.component';
import { ProgressCard } from './models/progress-card.model';

@Component({
  selector: 'app-progress-card',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    WidgetContainerComponent
  ],
  templateUrl: './progress-card.component.html',
  styleUrls: ['./progress-card.component.scss']
})
export class ProgressCardComponent {

  @Input({ required: true })
  data!: ProgressCard;

  get percentage(): number {

    if (this.data.total && this.data.total > 0) {
      return (this.data.value / this.data.total) * 100;
    }

    return this.data.value;

  }

}