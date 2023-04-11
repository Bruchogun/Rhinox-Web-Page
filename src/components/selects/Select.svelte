<script>
	import SvelteSelect from 'svelte-select';
	/** @type {any} */
	export let items
	export let selected = undefined;
	export let listPlacement;
</script>

<SvelteSelect {...$$restProps} {items} bind:selectedValue={selected} on:select {listPlacement}></SvelteSelect>