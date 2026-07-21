import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SocialLinksPage } from './social-links.page';

describe('SocialLinksPage', () => {
  let component: SocialLinksPage;
  let fixture: ComponentFixture<SocialLinksPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialLinksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
