import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { blogFormComponent } from './blog-form.component';

describe('blogFormComponent', () => {
  let component: blogFormComponent;
  let fixture: ComponentFixture<blogFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [blogFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(blogFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
