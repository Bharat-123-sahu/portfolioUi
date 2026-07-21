import { TestBed } from '@angular/core/testing';

import { blog } from './blog';

describe('blog', () => {
  let service: blog;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(blog);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
