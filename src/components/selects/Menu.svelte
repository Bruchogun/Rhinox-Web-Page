<script>

	export let product_to_sell;
	/** @type {"vertical" | "horizontal"}*/
	import { onMount } from 'svelte';
	import { apiFetch } from '../../functions';
	import Select from './Select.svelte';
	
	/**
	 * Get all vendible products, If needed
	 */
	let items;
	let combos;
	let recipes;
	let itemsToList= [];
	let combosToList= [];
	let recipesToList= [];
	let products_to_sell= [];
	let i= 0;

	onMount(async ()=>{
		({items} = await apiFetch('/api/items'));
		({combos} = await apiFetch('/api/combos'));
		({recipes} = await apiFetch('/api/recipes'));
	})

	function id_maker(){
		i++
		return i;
	}
	
	$:if (combos && items && recipes) {
		combosToList = combos.map( combo => {
			return ({
				...combo,
				category: 'combo',
				value: combo.id_combo, 
				label: `${combo.name}`,
				id: combo.id_combo })
			})
	
		itemsToList = items.map( item => {
			return ({
				...item,
				category: 'item',
				value: item.code, 
				label: `${item.code} | Marca: ${item.brand_name}`,
				id: item.id_item })		
			})
		itemsToList = itemsToList.filter(item => item.is_vendible)

		recipesToList = recipes.map( recipe => {
			return ({
				...recipe,
				category: 'recipe',
				value: recipe.id_recipe,
				label: `${recipe.name}`,
				id: recipe.id_recipe })
			})
		recipesToList = recipesToList.filter( recipe => recipe.is_vendible)

		products_to_sell = combosToList.concat(itemsToList)
		products_to_sell = products_to_sell.concat(recipesToList)

		products_to_sell = products_to_sell.map(product_to_sell => {
			return ({
				...product_to_sell,
				value: id_maker(),
				id: i
			})
		})
	}

</script>

<Select placeholder="Menú" bind:selected={product_to_sell} on:select items={products_to_sell} />
