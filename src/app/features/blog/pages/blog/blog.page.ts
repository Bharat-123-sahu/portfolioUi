import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { BlogListComponent } from '../../components/blog-list/blog-list.component';

@Component({
  selector: 'app-blog-page',
  standalone: true,
  imports: [CommonModule, IonicModule, BlogListComponent],
  templateUrl: './blog.page.html',
  styleUrls: ['./blog.page.scss'],
})
export class BlogPage {}
