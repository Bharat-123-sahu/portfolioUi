import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { IonicModule } from '@ionic/angular';

import { WidgetContainerComponent } from '../widget-container/widget-container.component';
import { WidgetListItem } from './models/widget-list-item.model';

@Component({
  selector: 'app-widget-list',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    DatePipe,
    WidgetContainerComponent
  ],
  templateUrl: './widget-list.component.html',
  styleUrls: ['./widget-list.component.scss']
})
export class WidgetListComponent {

  @Input()
  title = '';

  @Input()
  subtitle = '';

  @Input()
  icon = '';

  @Input()
  emptyMessage = 'No records found';

  @Input()
  items: WidgetListItem[] = [];

  @Output()
  itemClick = new EventEmitter<WidgetListItem>();

  open(item: WidgetListItem): void {

    if (item['disabled']) {
      return;
    }

    this.itemClick.emit(item);

  }

}