export interface DashboardStat {
  title: string;
  value: string | number;

  subtitle?: string;
  icon?: string;

  color?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'medium';

  trend?: number;
  loading?: boolean;
}