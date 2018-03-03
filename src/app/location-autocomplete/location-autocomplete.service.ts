import { Injectable } from '@angular/core';


export interface ILocationAutocompleteResult {
  name: string
}

// TODO: can we load places API from NPM?
@Injectable()
export class LocationAutocompleteService {

  private autocompleteService: google.maps.places.AutocompleteService;

  constructor() {
    this.autocompleteService = new google.maps.places.AutocompleteService();
  }

  getAutocompleteSuggestions(input: string): Promise<ILocationAutocompleteResult[]> {
    return new Promise(res => {
      this.autocompleteService.getPlacePredictions({
        input,
        componentRestrictions: {
          country: 'be'
        },
        types: ['(regions)']
      }, getResultMapper(res));
    });
  }
}

function getResultMapper(resolve): (input: google.maps.places.AutocompletePrediction[]) => void {
  return function (results: google.maps.places.AutocompletePrediction[]) {
    resolve(results.map(res => {
      return {
        name: res.structured_formatting.main_text
      }
    }));
  }
}
