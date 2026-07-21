export interface QuickAction {

  id: string;

  title: string;

  subtitle?: string;

  icon: string;

  route: string;

  color?: string;

  disabled?: boolean;

  external?: boolean;

}