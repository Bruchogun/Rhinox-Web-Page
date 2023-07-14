<script>

	export let item;
	export let sortBy = 'default';
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
		if(sortBy === 'Vendible'){
			itemsToList = items.map( item => {
					return ({...item,
							code: item.code,
							value: item.code, 
							label: `${item.code} | Disponible: ${Number(item.quantity).toFixed(1)}${item.unit} | Marca: ${item.brand_name}`,
							quantity: item.quantity,
							id: item.id_item })		
			})
			itemsToList = itemsToList.filter(item => item.is_vendible)
		}else if (sortBy === 'noVendible'){
			itemsToList = items.map( item => {
					return ({...item,
							code: item.code,
							value: item.code, 
							label: `${item.code} | Disponible: ${Number(item.quantity).toFixed(1)}${item.unit} | Marca: ${item.brand_name}`,
							quantity: item.quantity,
							id: item.id_item })		
			})
			itemsToList = itemsToList.filter(item => !item.is_vendible)
		}else if (sortBy === 'default'){
			itemsToList = items.map( item => {
				return ({...item,
						code: item.code,
						value: item.code, 
						label: `${item.code} | Disponible: ${Number(item.quantity).toFixed(1)}${item.unit} | Marca: ${item.brand_name}`,
						quantity: item.quantity,
						id: item.id_item })
			})

		}
	}

</script>

<Select placeholder="Artículos..." bind:selected={item} on:select items={itemsToList} {groupBy}/>
