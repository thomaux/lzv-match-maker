import { TestBed, inject } from '@angular/core/testing';

import { LocationAutocompleteService } from './location-autocomplete.service';

describe('LocationAutocompleteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocationAutocompleteService]
    });
  });

  it('should be created', inject([LocationAutocompleteService], (service: LocationAutocompleteService) => {
    expect(service).toBeTruthy();
  }));
});
