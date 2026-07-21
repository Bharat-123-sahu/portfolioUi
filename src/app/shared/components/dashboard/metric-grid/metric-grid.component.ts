import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { StatCardComponent } from '../stat-card/stat-card.component';
import { DashboardStat } from '../stat-card/models/stat-card.model';
// import { DashboardStat } from '../../../models/dashboard-stat.model';

@Component({
  selector: 'app-metric-grid',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    StatCardComponent
  ],
  templateUrl: './metric-grid.component.html',
  styleUrls: ['./metric-grid.component.scss']
})
export class MetricGridComponent {

  @Input()
  stats: DashboardStat[] = [];

}