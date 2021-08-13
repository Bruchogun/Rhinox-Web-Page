<script>

	export let product;
	/** @type {"vertical" | "horizontal"}*/
	import { onMount } from 'svelte';
	import { apiFetch } from '../../functions';
	import Select from './Select.svelte';
		
	/**
	 * Get products, If needed
	 */

    let products = [];
    let productsToList = [];
	onMount(async ()=>{
		 ({products} = await apiFetch('/api/products'));
	})

	$: if (products.length > 0) {
		productsToList = products.map(( product ) => {
			return ({...product, value: product.code, label: product.code})
		})
	}
</script>

<Select isCreatable="true" placeholder="Ingrese el código del artículo..." bind:selected={product} items={productsToList}/>