import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { blogListComponent } from './blog-list.component';

describe('blogListComponent', () => {
  let component: blogListComponent;
  let fixture: ComponentFixture<blogListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [blogListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(blogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
