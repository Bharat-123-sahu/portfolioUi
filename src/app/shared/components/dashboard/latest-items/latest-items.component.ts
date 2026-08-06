import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { WidgetListItem } from '../widget-list/models/widget-list-item.model';

@Component({
  selector: 'app-latest-items',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './latest-items.component.html',
  styleUrls: ['./latest-items.component.scss'],
})
export class LatestItemsComponent {
  @Input() title = 'Latest Items';
  @Input() items: WidgetListItem[] = [];
}
