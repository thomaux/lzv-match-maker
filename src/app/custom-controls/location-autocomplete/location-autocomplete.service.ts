import { Injectable } from '@angular/core';
import {} from '@types/googlemaps';

export interface ILocationAutocompleteResult {
  name: string,
  id: string
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

function getResultMapper(resolve): (input: google.maps.places.AutocompletePrediction[], status: google.maps.places.PlacesServiceStatus) => void {
  return function (results, status) {

    // TODO handle ZERO_RESULTS case
    if(status !== google.maps.places.PlacesServiceStatus.OK) {
      resolve([]);
      return;
    }

    resolve(results.map(res => {
      return {
        name: res.structured_formatting.main_text,
        id: res.place_id
      }
    }));
  }
}
