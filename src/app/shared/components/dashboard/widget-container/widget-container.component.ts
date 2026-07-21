import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-widget-container',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule
  ],
  templateUrl: './widget-container.component.html',
  styleUrls: ['./widget-container.component.scss']
})
export class WidgetContainerComponent {

  @Input()
  title = '';

  @Input()
  subtitle? = '';

  @Input()
  icon? = '';

  @Input()
  loading = false;

}