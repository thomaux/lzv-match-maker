import { Component, Vue, Prop } from 'vue-property-decorator';
import template from './ListingsQuery.html';
import { getRegions } from '../common/services/ApiService';
import { ListingsQueryModel, ListingsQueryParameters } from './ListingsQueryModel';

@Component({
    template
})
export class ListingsQuery extends Vue {

    @Prop(Object)
    initial: ListingsQueryParameters;

    regions = [];
    model: ListingsQueryModel = {} as any;

    async beforeMount() {
        this.regions = await getRegions();
    }

    mounted() {
        this.model = new ListingsQueryModel(this.initial);
        this.updateQuery();
    }

    updateQuery() {
        this.$emit('update', this.model);
    }
}