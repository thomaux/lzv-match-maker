import { Component, Vue } from 'vue-property-decorator';
import { ListingList } from '../listing/ListingList';
import { searchListings } from '../listing/ListingService';
import template from './App.html';

@Component({
    template,
    components: {
        ListingList
    }
})
export class App extends Vue {

    listings: any[] = [];

    async mounted() {
        this.listings = await searchListings();
    }

}
