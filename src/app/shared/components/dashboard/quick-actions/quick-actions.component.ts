import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { WidgetContainerComponent } from '../widget-container/widget-container.component';
import { QuickAction } from './models/quick-actions.model';

@Component({
  selector: 'app-quick-actions',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    WidgetContainerComponent
  ],
  templateUrl: './quick-actions.component.html',
  styleUrls: ['./quick-actions.component.scss']
})
export class QuickActionsComponent {

  @Input()
  actions: QuickAction[] = [];

  @Output()
  actionClick = new EventEmitter<QuickAction>();

  onAction(action: QuickAction): void {

    if (action.disabled) {
      return;
    }

    this.actionClick.emit(action);

  }

}