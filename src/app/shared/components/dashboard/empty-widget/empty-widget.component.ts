import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-empty-widget',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './empty-widget.component.html',
  styleUrls: ['./empty-widget.component.scss'],
})
export class EmptyWidgetComponent {
  @Input() icon = 'folder-open-outline';
  @Input() title = 'No data available';
  @Input() message = 'There is nothing to show yet.';
}
