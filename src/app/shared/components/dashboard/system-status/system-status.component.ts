import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { StatusCardItem } from '../status-card/models/status-card.model';

@Component({
  selector: 'app-system-status',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './system-status.component.html',
  styleUrls: ['./system-status.component.scss'],
})
export class SystemStatusComponent {
  @Input() items: StatusCardItem[] = [];

  getColor(status: StatusCardItem['status']): string {
    return status === 'online' ? 'success' : status === 'warning' ? 'warning' : status === 'offline' ? 'danger' : 'medium';
  }
}
