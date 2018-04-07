import { TestBed, inject } from '@angular/core/testing';

import { EmotionService } from './emotion.service';

describe('EmotionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmotionService]
    });
  });

  it('should be created', inject([EmotionService], (service: EmotionService) => {
    expect(service).toBeTruthy();
  }));
});
