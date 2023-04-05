<script>

	export let brand;
	import { onMount } from 'svelte';
	import { apiFetch } from '../../functions';
	import Select from './Select.svelte';
	
	/**
	 * Get brands, If needed
	 */

    let brands = [];
    let brandsToList = [];
	onMount(async ()=>{
		({brands} = await apiFetch('/api/brands'));
	})

	$: if (brands.length > 0) {
		brandsToList = brands.map(( brand ) => {
			return ({...brand, id:brand.id_brand , value: brand.name, label: brand.name})
		})
	}

</script>

<Select isCreatable="true" placeholder="Marcas..." bind:selected={brand} items={brandsToList}/>