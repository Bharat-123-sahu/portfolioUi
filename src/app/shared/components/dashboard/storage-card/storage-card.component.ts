import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-storage-card',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './storage-card.component.html',
  styleUrls: ['./storage-card.component.scss'],
})
export class StorageCardComponent {
  @Input() used = 0;
  @Input() total = 100;
  @Input() label = 'Storage';

  get percentage(): number {
    return this.total > 0 ? Math.min(100, Math.max(0, (this.used / this.total) * 100)) : 0;
  }
}
