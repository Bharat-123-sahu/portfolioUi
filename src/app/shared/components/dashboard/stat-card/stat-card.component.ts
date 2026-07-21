import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { WidgetContainerComponent } from "../widget-container/widget-container.component";

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    WidgetContainerComponent
],
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.scss']
})
export class StatCardComponent {

  @Input()
  title = '';

  @Input()
  subtitle? = '';

  @Input()
  value: string | number = 0;

  @Input()
  icon = 'stats-chart-outline';

  @Input()
  color:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'medium'
    = 'primary';

  @Input()
  trend?: number;

  @Input()
  loading = false;

}