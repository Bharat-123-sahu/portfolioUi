import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';

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
import { LoadingComponent } from 'src/app/shared/components/loading/loading.component';
import { EmptyStateComponent } from 'src/app/shared/components/empty-state/empty-state.component';
import { UiFeedbackService } from 'src/app/shared/services/ui-feedback.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  imports: [
    CommonModule,
    WelcomeBannerComponent,
    MetricGridComponent,
    WidgetListComponent,
    ProgressCardComponent,
    StatusCardComponent,
    QuickActionsComponent,
    LoadingComponent,
    EmptyStateComponent,
    IonContent,
  ],
})
export class DashboardPage implements OnInit {
  private dashboardService = inject(DashboardService);
  private uiFeedback = inject(UiFeedbackService);

  loading = true;

  errorMessage = '';

  stats: DashboardStat[] = [];

  quickActions: QuickAction[] = [];

  latestProjects: WidgetListItem[] = [];

  latestBlogs: WidgetListItem[] = [];

  recentActivities: WidgetListItem[] = [];

  storage!: ProgressCard;

  systemStatus: StatusCardItem[] = [];

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    this.errorMessage = '';

    this.dashboardService.getAll().subscribe({
      next: (response: any) => {
        this.stats = response.stats ?? [];
        this.latestProjects = response.latestProjects ?? [];
        this.latestBlogs = response.latestBlogs ?? [];
        this.recentActivities = response.activities ?? response.recentActivities ?? [];
        this.storage = response.storage;
        this.systemStatus = response.systemStatus ?? [];
        this.quickActions = response.quickActions ?? [];

        this.loading = false;
      },
      error: async () => {
        this.errorMessage = 'Unable to load dashboard data. Please try again.';
        this.loading = false;
        await this.uiFeedback.error(this.errorMessage);
      },
    });
  }
}
