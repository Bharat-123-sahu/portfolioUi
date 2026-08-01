import { Component } from '@angular/core';
import { ProjectsComponent as ProjectsSectionComponent } from '../../sections/projects/projects.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  standalone: true,
  imports: [ProjectsSectionComponent],
})
export class ProjectsComponent {}
