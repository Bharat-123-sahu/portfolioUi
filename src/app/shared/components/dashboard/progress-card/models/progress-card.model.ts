export interface ProgressCard {

  title: string;

  subtitle?: string;

  icon?: string;

  value: number;

  total?: number;

  unit?: string;

  color?: string;

  showPercentage?: boolean;

}

// export interface ProgressCard {

//   title: string;

//   subtitle?: string;

//   icon?: string;

//   current: number;

//   total: number;

//   unit?: string;

//   progressColor?: string;

//   status?: 'healthy' | 'warning' | 'critical';

//   footer?: string;

//   trend?: number;

//   lastUpdated?: Date;

// }