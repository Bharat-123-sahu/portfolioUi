export interface TableColumn {

  key: string;

  label: string;

  type?: 'text' | 'image' | 'badge' | 'date' |'file' |'platform'|'link'|'boolean';

  width?: string;

}