import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LocationAutocompleteService, ILocationAutocompleteResult } from './location-autocomplete.service';

@Component({
  selector: 'location-autocomplete',
  templateUrl: './location-autocomplete.component.html',
  styleUrls: ['./location-autocomplete.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => LocationAutocompleteComponent),
    }
  ]
})
export class LocationAutocompleteComponent implements OnInit, ControlValueAccessor {

  @Input()
  locationId = "";

  query = "";
  results = [];
  showResults = false;

  propagateChange = (_: any) => {};

  constructor(private locationAutocompleteService: LocationAutocompleteService) { }

  ngOnInit() {
  }

  onChange() {
    if(!this.query.length) {
      this.onResultsUpdated([]);
      return;
    }

    this.locationAutocompleteService.getAutocompleteSuggestions(this.query)
      .then(this.onResultsUpdated.bind(this));
  }

  onResultsUpdated(results: ILocationAutocompleteResult[]) {
    this.results = results;
    this.showResults = results.length > 0;
  }

  onLocationSelected(location: ILocationAutocompleteResult) {
    this.query = location.name;
    this.showResults = false;
    this.propagateChange(location);
  }

  writeValue(obj: any): void {
    this.locationId = this.query + "foobar";
  }
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {
    console.error("register on touched not implemented.");
  }
  setDisabledState?(isDisabled: boolean): void {
    console.error("set disabled state not implemented.");
  }

}
