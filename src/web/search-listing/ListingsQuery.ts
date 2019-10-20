import { Component, Prop, Vue } from 'vue-property-decorator';
import template from './ListingsQuery.html';
import { ListingsQueryModel, ListingsQueryParameters } from './ListingsQueryModel';
import { RegionSelector } from '../common/components/RegionSelector';

@Component({
    template,
    components: {
        RegionSelector
    }
})
export class ListingsQuery extends Vue {

    @Prop(Object)
    initial: ListingsQueryParameters;
    
    model: ListingsQueryModel = {} as any;

    mounted() {
        this.model = new ListingsQueryModel(this.initial);
        this.updateQuery();
    }

    updateQuery() {
        this.$emit('update', this.model);
    }
}