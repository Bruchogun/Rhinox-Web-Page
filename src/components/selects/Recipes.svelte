<script>

	export let recipe;
	export let sortByVendible = false;
	/** @type {"vertical" | "horizontal"}*/
	import { onMount } from 'svelte';
	import { apiFetch } from '../../functions';
	import Select from './Select.svelte';
	
	/**
	 * Get recipes, If needed
	 */
	let recipes;
	const groupBy = (recipe) => recipe.category;
	onMount(async ()=>{
		({recipes} = await apiFetch('/api/recipes'));
	})
	
	let recipesToList= [];
	$: if (recipes) {
		if(sortByVendible){
			recipesToList = recipes.map( recipe => {
					return ({...recipe,
							value: recipe.id_recipe, 
							label: `${recipe.name}`,
							id: recipe.id_recipe })
			})
			recipesToList = recipesToList.filter( recipe => recipe.is_vendible)
		}else{
			recipesToList = recipes.map( recipe => {
					return ({...recipe,
							value: recipe.id_recipe, 
							label: `${recipe.name}`,
							id: recipe.id_recipe })
			})
		}
	}

</script>

<Select placeholder="Recetas..." bind:selected={recipe} on:select items={recipesToList} {groupBy}/>
