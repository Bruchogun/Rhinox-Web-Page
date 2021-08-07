<script>

	export let supplier;
	/** @type {"vertical" | "horizontal"}*/
	import { onMount } from 'svelte';
	import { apiFetch } from '../../functions';
	import Select from './Select.svelte';
	
	/**
	 * Get suppliers, If needed
	 */

    let suppliers = [];
    let suppliersToList = [];
	onMount(async ()=>{
		 ({suppliers} = await apiFetch('/api/suppliers'));
	})

	$: if (suppliers.length > 0) {
		suppliersToList = suppliers.map(({ id_supplier, name }) => {
			return ({value: id_supplier, label: name})
		})
	}

</script>

<Select placeholder="Proveedores..." bind:selected={supplier} items={suppliersToList}/>