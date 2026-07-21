import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-search-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
  ],
  templateUrl: './search-toolbar.component.html',
  styleUrls: ['./search-toolbar.component.scss'],
})
export class SearchToolbarComponent {

  @Input() placeholder = 'Search...';

  @Output() search = new EventEmitter<string>();

  onSearch(event: any): void {
    this.search.emit(event.detail.value || '');
  }

}