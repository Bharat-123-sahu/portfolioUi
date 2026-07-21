import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { WidgetContainerComponent } from '../widget-container/widget-container.component';
import { StatusCardItem } from './models/status-card.model';

@Component({
  selector: 'app-status-card',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    
    WidgetContainerComponent
  ],
  templateUrl: './status-card.component.html',
  styleUrls: ['./status-card.component.scss']
})
export class StatusCardComponent {

  @Input()
  title = 'System Status';

  @Input()
  subtitle = 'Live service health';

  @Input()
  icon = 'pulse-outline';

  @Input()
  items: StatusCardItem[] = [];

  getStatusColor(status: StatusCardItem['status']): string {

    switch (status) {

      case 'online':
        return 'success';

      case 'warning':
        return 'warning';

      case 'offline':
        return 'danger';

      case 'maintenance':
        return 'medium';

      default:
        return 'primary';

    }

  }

}