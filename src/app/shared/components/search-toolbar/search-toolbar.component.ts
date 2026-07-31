import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SearchbarCustomEvent } from '@ionic/angular';
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

  @Output() searchChanged = new EventEmitter<string>();

  onSearch(event: SearchbarCustomEvent): void {
    this.searchChanged.emit(event.detail.value || '');
  }

}
