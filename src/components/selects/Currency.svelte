<script>
	import {
		FormGroup,
		RadioButtonGroup,
		RadioButton,
	}
	from "carbon-components-svelte";

	export let currency = null;
	/** @type {"vertical" | "horizontal"}*/
	export let orientation = "horizontal";

    import { onMount } from 'svelte';
	import { apiFetch } from "../../functions";
	
	/**
	 * Get currencys, If needed
	 */
	let currencys;
	onMount(async ()=>{
		if (!currencys) {
			({currencys} = await apiFetch('/api/currencys'));
		}
		if( screen.width <= 480 ) {
			orientation="vertical"
			// is mobile
		}
	})

</script>

<FormGroup legendText="Moneda">
	<RadioButtonGroup on:change id="currency" {orientation} bind:selected={currency}>
		{#if currencys}
			{#each currencys as currency}
				<RadioButton labelText={`${currency.name_plural.replace(/(^|\s)\S/g, l => l.toUpperCase())} (${currency.symbol})`} value={currency} />	
			{/each}
		{/if}
	</RadioButtonGroup>
</FormGroup>