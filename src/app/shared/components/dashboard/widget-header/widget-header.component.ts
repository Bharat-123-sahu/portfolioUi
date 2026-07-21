import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-widget-header',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule
  ],
  templateUrl: './widget-header.component.html',
  styleUrls: ['./widget-header.component.scss']
})
export class WidgetHeaderComponent {

  @Input()
  title = '';

  @Input()
  subtitle = '';

  @Input()
  icon = '';

  @Input()
  showRefresh = false;

  @Input()
  refreshing = false;

  @Output()
  refresh = new EventEmitter<void>();

  onRefresh(): void {

    this.refresh.emit();

  }

}