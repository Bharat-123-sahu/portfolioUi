import { TestBed } from '@angular/core/testing';

import { SocialLinks } from './social-links';

describe('SocialLinks', () => {
  let service: SocialLinks;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocialLinks);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
