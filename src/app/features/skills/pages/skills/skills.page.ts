import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SkillListComponent } from '../../components/skills-list/skills-list.component';

// import { SkillListComponent } from '../../components/skill-list/skill-list.component';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [
    IonicModule,
    SkillListComponent
  ],
  templateUrl: './skills.page.html',
  styleUrls: ['./skills.page.scss']
})
export class SkillsPage {}