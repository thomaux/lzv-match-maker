import { Component, OnInit } from '@angular/core';
import { OfferService } from './offer.service';
import { Offer } from './offer';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.css']
})
export class OfferComponent implements OnInit {

  model = new Offer(undefined, { postalCode: undefined, gymName: undefined }, [], true);

  constructor(private offerService: OfferService) { }

  ngOnInit() {
  }

  onSubmit() {
    this.offerService.createOffer(this.model)
      .then(() => alert('success'))
  }

  isLevelSelected(lvl: number) {
    return this.model.forLevels.indexOf(lvl) > -1;
  }

  toggleLevelSelection(lvl: number) {
    const idx = this.model.forLevels.indexOf(lvl);
    if(idx > -1) {
      this.model.forLevels.splice(idx, 1);
    } else {
      this.model.forLevels.push(lvl);
    }
  }
}
