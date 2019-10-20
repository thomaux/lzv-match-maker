import { Component, Prop, Vue } from 'vue-property-decorator';
import { getRegions } from '../services/ApiService';
import template from './RegionSelector.html';

@Component({
    template
})
export class RegionSelector extends Vue {

    @Prop()
    value: string;

    regionId = 0;

    regions = [];

    async beforeMount() {
        this.regions = await getRegions();
        // The initial value will be just the id, so set it to the internal "regionId" representation
        this.regionId = parseInt(this.value);
        // Then replace the value with an actual region by triggering the "input" event
        this.update(this.value);
    }

    update(regionId: any) {
        regionId = parseInt(regionId);
        this.$emit('input', this.regions.find(r => r._id === regionId));
    }
}