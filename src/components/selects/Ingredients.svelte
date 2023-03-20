<script>

	export let ingredient;
	/** @type {"vertical" | "horizontal"}*/
	import { onMount } from 'svelte';
	import { apiFetch } from '../../functions';
	import Select from './Select.svelte';
	
	/**
	 * Get ingredients, If needed
	 */
	let ingredients;
	const groupBy = (ingredient) => ingredient.category;
	onMount(async ()=>{
		({ingredients} = await apiFetch('/api/ingredients'));
	})
	
	let ingredientsToList= [];
	$: if (ingredients) {
		ingredientsToList = ingredients.map( ingredient => {
			return ({...ingredient,
					code: ingredient.product_code,
					value: ingredient.product_code, 
					label: `Código: ${ingredient.product_code} | Disponible: ${Number(ingredient.quantity).toFixed(2)}${ingredient.unit} | Marca: ${ingredient.brand_name}`,
					quantity: ingredient.quantity,
					id: ingredient.id_ingredient })
		})
	}

</script>

<Select placeholder="Artículos..." bind:selected={ingredient} on:select ingredients={ingredientsToList} {groupBy}/>
