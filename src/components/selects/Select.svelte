<script>
	import SvelteSelect from 'svelte-select';
	/** @type {any} */
	export let items
	export let selected = undefined;
</script>

<SvelteSelect {...$$restProps} {items} bind:selectedValue={selected} on:select></SvelteSelect>