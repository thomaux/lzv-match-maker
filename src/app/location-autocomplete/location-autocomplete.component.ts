import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LocationAutocompleteService } from './location-autocomplete.service';

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

  propagateChange = (_: any) => {};

  constructor(private locationAutocompleteService: LocationAutocompleteService) { }

  ngOnInit() {
  }

  onChange() {
    this.locationAutocompleteService.getAutocompleteSuggestions(this.query)
      .then(res => this.results = res);
  }

  onLocationSelected(location) {
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
