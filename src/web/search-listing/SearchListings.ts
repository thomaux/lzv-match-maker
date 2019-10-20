import { Component, Vue } from 'vue-property-decorator';
import { findListings } from '../common/services/ApiService';
import template from './SearchListings.html';
import { ListingsQuery } from './ListingsQuery';
import { ListingsQueryModel } from './ListingsQueryModel';

@Component({
    template,
    components: {
        ListingsQuery
    }
})
export class SearchListings extends Vue {

    listings: any[] = [];
    queryString = {};

    beforeMount() {
        this.queryString = this.$router.currentRoute.query;
    }

    async filterListings(query: ListingsQueryModel) {
        this.$router.replace({
            path: '/search',
            query: query.toQueryObject() as any
        });

        this.listings = await findListings(query);
    }
}
