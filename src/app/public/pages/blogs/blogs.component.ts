import { Component } from '@angular/core';
import { BlogComponent } from '../../sections/blog/blog.component';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss'],
  standalone: true,
  imports: [BlogComponent],
})
export class BlogsComponent {}
