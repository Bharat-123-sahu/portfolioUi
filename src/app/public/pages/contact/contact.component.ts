import { Component } from '@angular/core';
import { ContactComponent as ContactSectionComponent } from '../../sections/contact/contact.component';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  standalone: true,
  imports: [ContactSectionComponent],
})
export class ContactComponent {}
