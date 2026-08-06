import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { WidgetListItem } from '../widget-list/models/widget-list-item.model';

@Component({
  selector: 'app-recent-activities',
  standalone: true,
  imports: [CommonModule, DatePipe, IonicModule],
  templateUrl: './recent-activities.component.html',
  styleUrls: ['./recent-activities.component.scss'],
})
export class RecentActivitiesComponent {
  @Input() activities: WidgetListItem[] = [];
}
