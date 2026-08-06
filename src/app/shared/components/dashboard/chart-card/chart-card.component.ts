import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-chart-card',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './chart-card.component.html',
  styleUrls: ['./chart-card.component.scss'],
})
export class ChartCardComponent {
  @Input() title = 'Overview';
  @Input() value = 0;
  @Input() max = 100;
  @Input() color = 'primary';

  get percentage(): number {
    return this.max > 0 ? Math.min(100, Math.max(0, (this.value / this.max) * 100)) : 0;
  }
}
