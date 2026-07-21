import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AboutListComponent } from './about-list.component';

describe('AboutListComponent', () => {
  let component: AboutListComponent;
  let fixture: ComponentFixture<AboutListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AboutListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
