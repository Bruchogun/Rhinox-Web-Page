<script>

	export let item;
	/** @type {"vertical" | "horizontal"}*/
	import { onMount } from 'svelte';
	import { apiFetch } from '../../functions';
	import Select from './Select.svelte';
	
	/**
	 * Get items, If needed
	 */
	let items;
	const groupBy = (item) => item.category;
	onMount(async ()=>{
		({items} = await apiFetch('/api/items'));
	})
	
	let itemsToList= [];
	$: if (items) {
		itemsToList = items.map( item => {
			return ({...item,
					code: item.product_code,
					value: item.product_code, 
					label: `Código: ${item.product_code} | Disponible: ${Number(item.quantity).toFixed(2)}${item.unit} | Marca: ${item.brand_name}`,
					quantity: item.quantity,
					id: item.id_item })
		})
	}

</script>

<Select placeholder="Artículos..." bind:selected={item} on:select items={itemsToList} {groupBy}/>
