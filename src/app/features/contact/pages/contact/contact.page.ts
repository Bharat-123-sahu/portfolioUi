import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ContactListComponent } from '../../components/contact-list/contact-list.component';


@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ContactListComponent
  ],
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss']
})
export class ContactPage {}