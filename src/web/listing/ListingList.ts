import { Component, Vue, Prop } from 'vue-property-decorator';
import template from './ListingList.html';

@Component({
    template
})
export class ListingList extends Vue {

    @Prop()
    listings: any[];
}
