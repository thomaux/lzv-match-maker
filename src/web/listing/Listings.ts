import { Component, Vue } from 'vue-property-decorator';
import { findListings, getRegions } from '../common/services/ApiService';
import template from './Listings.html';
import { ListingsQuery } from './ListingsQuery';

@Component({
    template
})
export class Listings extends Vue {

    listings: any[] = [];
    regions = [];
    query: ListingsQuery = {} as any;

    async mounted() {
        this.query = new ListingsQuery(this.$router.currentRoute.query as any);
        this.regions = await getRegions();
        this.filterListings();
    }

    async filterListings() {
        this.$router.replace({
            path: '/listings',
            query: this.query.toQueryObject() as any
        });

        this.listings = await findListings(this.query);
    }
}
