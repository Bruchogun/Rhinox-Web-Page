<script>
	import SelectSearch from './Select.svelte';

	export let measure;
	/** @type {"vertical" | "horizontal"}*/
	import { onMount } from 'svelte';
	import { apiFetch } from '../../functions';
	
	/**
	 * Get measures, If needed
	 */

    let data = [];
    let measuresToList = [];
	onMount(async ()=>{
		 ({data} = await apiFetch('/api/measures'));
	})

	$: if (data.length > 0) {
		measuresToList = data.map(({ name, id_measure }) => {
			return ({value: id_measure, label: name})
		})
	}

</script>

<SelectSearch placeholder="Unidades de medición..." bind:selected={measure} items={measuresToList}/>