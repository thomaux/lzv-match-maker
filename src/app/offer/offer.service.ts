import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class OfferService {

  constructor(private http: Http) { }

  // Get all posts from the API
  createOffer(offer) {
    return this.http.post('/api/offer', offer)
      .toPromise();
  }
}