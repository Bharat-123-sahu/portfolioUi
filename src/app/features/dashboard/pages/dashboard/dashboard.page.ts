import { Component, OnInit } from '@angular/core';

import { WidgetListItem } from 'src/app/shared/components/dashboard/widget-list/models/widget-list-item.model';
import { ProgressCard } from 'src/app/shared/components/dashboard/progress-card/models/progress-card.model';
import { StatusCardItem } from 'src/app/shared/components/dashboard/status-card/models/status-card.model';
// import { DashboardStat } from 'src/app/shared/models/dashboard-stat.model';
import { QuickAction } from 'src/app/shared/components/dashboard/quick-actions/models/quick-actions.model';
import { DashboardService } from '../../services/dashboard';
import { WelcomeBannerComponent } from 'src/app/shared/components/dashboard/welcome-banner/welcome-banner.component';
import { MetricGridComponent } from 'src/app/shared/components/dashboard/metric-grid/metric-grid.component';
import { WidgetListComponent } from 'src/app/shared/components/dashboard/widget-list/widget-list.component';
import { ProgressCardComponent } from 'src/app/shared/components/dashboard/progress-card/progress-card.component';
import { StatusCardComponent } from 'src/app/shared/components/dashboard/status-card/status-card.component';
import { QuickActionsComponent } from 'src/app/shared/components/dashboard/quick-actions/quick-actions.component';
import { IonContent } from '@ionic/angular/standalone';
import { DashboardStat } from 'src/app/shared/components/dashboard/stat-card/models/stat-card.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  imports: [
    WelcomeBannerComponent,
    MetricGridComponent,
    WidgetListComponent,
    ProgressCardComponent,
    StatusCardComponent,
    QuickActionsComponent,
    IonContent,
  ],
})
export class DashboardPage implements OnInit {
  loading = true;

  stats: DashboardStat[] = [];

  quickActions: QuickAction[] = [];

  latestProjects: WidgetListItem[] = [];

  latestBlogs: WidgetListItem[] = [];

  recentActivities: WidgetListItem[] = [];

  storage!: ProgressCard;

  systemStatus: StatusCardItem[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
     console.log('Dashboard Init');
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
 console.log('load service Init');
    this.dashboardService.getAll().subscribe({
      next: (response: any) => {
        this.stats = response.stats ?? [];
        this.latestProjects = response.latestProjects ?? [];
        this.latestBlogs = response.latestBlogs ?? [];
        this.recentActivities = response.recentActivities ?? [];
        this.storage = response.storage;
        this.systemStatus = response.systemStatus ?? [];
        this.quickActions = response.quickActions ?? [];

        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
      },
    });
  }
}
