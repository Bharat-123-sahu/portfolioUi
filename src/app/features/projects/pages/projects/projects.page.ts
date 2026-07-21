import { Component, OnInit } from '@angular/core';
import { ProjectListComponent } from "../../components/projects-list/projects-list.component";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.page.html',
  styleUrls: ['./projects.page.scss'],
  standalone: true,
  imports: [ ProjectListComponent]
})
export class ProjectsPage {}
