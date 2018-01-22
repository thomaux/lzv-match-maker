import { Component, OnInit } from '@angular/core';
import { OfferService } from './offer.service';
import { Offer } from './offer';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.css']
})
export class OfferComponent implements OnInit {

  model = new Offer('');

  constructor(private offerService: OfferService) { }

  ngOnInit() {
  }

  onSubmit() {
    this.offerService.createOffer(this.model)
      .subscribe(() => alert('success'))
  }
}
