<script>

	export let item;
	/** @type {"vertical" | "horizontal"}*/
	import { onMount } from 'svelte';
	import { apiFetch } from '../../functions';
	import Select from './Select.svelte';
	
	/**
	 * Get items, If needed
	 */
	let stocks;
	const groupBy = (item) => item.category;
	onMount(async ()=>{
		({stocks} = await apiFetch('/api/items'));
	})
	
	let itemsToList= [];
	$: if (stocks) {
		console.log(stocks);
		itemsToList = stocks.map( item => {
			return ({...item,
					code: item.products_code,
					value: item.products_code, 
					label: `Código: ${item.products_code} | Disponible: ${Number(item.stocks_quantity).toFixed(2)}${item.unit} | Almacén: ${item.storages_name}`,
					quantity: item.stocks_quantity,
					id: item.id_stock })
		})
	}

</script>

<Select placeholder="Artículos..." bind:selected={item} on:select items={itemsToList} {groupBy}/>
