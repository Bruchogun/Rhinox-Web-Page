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
		suppliersToList = suppliers.map((supplier) => {
			return ({...supplier, value: supplier.id_supplier, label: supplier.name})
		})
	}

</script>

<Select placeholder="Proveedores..." bind:selected={supplier} items={suppliersToList} isCreatable="true"/>