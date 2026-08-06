import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { assetUrl } from 'src/app/core/utils/url.util';
import { TableColumn } from '../../models/table-column.model';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule
  ],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent {

  @Input() columns: TableColumn[] = [];

  @Input() data: any[] = [];

  @Input() loading = false;

  @Input() emptyTitle = 'No records found';

  @Input() emptyMessage = 'Create a new item or adjust your search filters.';

  @Input() showActions = true;

  @Output() edit = new EventEmitter<any>();

  @Output() delete = new EventEmitter<any>();

  onEdit(row: any): void {
    this.edit.emit(row);
  }

  onDelete(row: any): void {
    this.delete.emit(row);
  }

  getValue(row: any, key: string): any {
    return row?.[key];
  }

  getImageUrl(path: string | null | undefined): string {

    if (!path) {
      return 'assets/images/no-image.png';
    }

    if (
      path.startsWith('http://') ||
      path.startsWith('https://')
    ) {
      return path;
    }

    return assetUrl(path, 'assets/images/no-image.png');
  }

  getBadgeColor(value: any): string {

    return value ? 'success' : 'danger';

  }

  getBadgeText(value: any): string {

    return value ? 'Active' : 'Inactive';

  }

  trackByIndex(index: number): number {

    return index;

  }

  skeletonRows(): number[] {
    return Array.from({ length: 5 }, (_, index) => index);
  }

}
