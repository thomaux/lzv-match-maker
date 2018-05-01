import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { LocationAutocompleteComponent } from './location-autocomplete/location-autocomplete.component';
import { LocationAutocompleteService } from './location-autocomplete/location-autocomplete.service';


@NgModule({
  declarations: [
    LocationAutocompleteComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
  ],
  exports: [LocationAutocompleteComponent],
  providers: [LocationAutocompleteService]
})
export class CustomControlsModule { }
