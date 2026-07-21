import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SettingsFormComponent } from '../../components/settings-form/settings-form.component';


@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    SettingsFormComponent
  ],
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss']
})
export class SettingsPage {}