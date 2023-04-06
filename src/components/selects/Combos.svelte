<script>

	export let combo;
	/** @type {"vertical" | "horizontal"}*/
	import { onMount } from 'svelte';
	import { apiFetch } from '../../functions';
	import Select from './Select.svelte';
	
	/**
	 * Get combos, If needed
	 */
	let combos;
	onMount(async ()=>{
		({combos} = await apiFetch('/api/combos'));
	})
	
	let combosToList= [];
	$: if (combos) {
		combosToList = combos.map( combo => {
			return ({...combo,
					value: combo.id_combo, 
					label: `${combo.name}`,
					id: combo.id_combo })
		})
	}

</script>

<Select placeholder="Combos..." bind:selected={combo} on:select items={combosToList} />
