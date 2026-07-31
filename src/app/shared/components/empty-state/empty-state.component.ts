import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule
  ],
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss'],
})
export class EmptyStateComponent {

  @Input() icon = 'folder-open-outline';

  @Input() title = 'No Data Found';

  @Input() message = 'There is nothing to display.';

  @Input() actionText = '';

  @Input() color = 'medium';

  @Output() action = new EventEmitter<void>();

}
