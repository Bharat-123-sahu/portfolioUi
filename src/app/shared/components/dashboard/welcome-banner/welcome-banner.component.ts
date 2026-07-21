import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-welcome-banner',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    DatePipe
  ],
  templateUrl: './welcome-banner.component.html',
  styleUrls: ['./welcome-banner.component.scss']
})
export class WelcomeBannerComponent implements OnInit {

  @Input()
  userName = 'Admin';

  currentDate = new Date();

  greeting = '';

  ngOnInit(): void {
    this.setGreeting();
  }

  private setGreeting(): void {

    const hour = new Date().getHours();

    if (hour < 12) {
      this.greeting = 'Good Morning';
    } else if (hour < 17) {
      this.greeting = 'Good Afternoon';
    } else {
      this.greeting = 'Good Evening';
    }

  }

}