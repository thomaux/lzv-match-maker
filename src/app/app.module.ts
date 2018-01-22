import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, RouterLink } from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { OfferComponent } from './offer/offer.component';
import { SearchComponent } from './search/search.component';
import { OfferService } from './offer/offer.service';

const ROUTES = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'offer',
    component: OfferComponent
  },
  {
    path: 'search',
    component: SearchComponent
  }
];
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    OfferComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES),
    FormsModule,
    HttpModule
  ],
  providers: [OfferService],
  bootstrap: [AppComponent]
})
export class AppModule { }
