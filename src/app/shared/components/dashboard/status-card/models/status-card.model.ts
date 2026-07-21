export type ServiceStatus =
  | 'online'
  | 'offline'
  | 'warning'
  | 'maintenance';

export interface StatusCardItem {

  id: string;

  title: string;

  subtitle?: string;

  icon?: string;

  status: ServiceStatus;

  responseTime?: number;

  lastChecked?: Date | string;

}