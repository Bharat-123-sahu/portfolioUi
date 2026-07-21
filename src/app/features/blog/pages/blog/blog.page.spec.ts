import { ComponentFixture, TestBed } from '@angular/core/testing';
import { blogPage } from './blog.page';

describe('blogPage', () => {
  let component: blogPage;
  let fixture: ComponentFixture<blogPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(blogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
