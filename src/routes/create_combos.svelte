<script>
	import 'carbon-components-svelte/css/white.css';
	import { TextInput, Button, TextArea, FluidForm, Tile } from "carbon-components-svelte";
	import { apiFetch } from '../functions';
	import Items_quantity from '../components/Items_quantity.svelte';
	import Recipes_quantity from '../components/Recipes_quantity.svelte';

	let name;
	let price;
	let items_quantity;
	let recipes_quantity;
	let description;

	async function create_combo(){
		await apiFetch("/api/create_combo",{
			method: 'POST',
			body: JSON.stringify({
				name,
				price,
				items_quantity,
				recipes_quantity,
				description
			}),
			headers: {'Content-Type': 'application/json'}
		})
		name = '';
		price = 0;
		items_quantity = [];
		recipes_quantity = [];
		description = '';
	}


</script>

<style>
	.OnSameLine{
		display: flex;
		flex-wrap: wrap;
	}
</style>

<FluidForm on:submit={create_combo}>
	
	<TextInput type="Text" labelText="Nombre del Combo" placeholder="Ingrese el nombre..." bind:value={name}/>
	
	<TextInput type="Number" step={0.01} labelText="Precio del Combo" placeholder="Ingrese precio..." bind:value={price}/>

	<div class="OnSameLine">
		
		<Items_quantity label="Artículos" bind:items_recipe={items_quantity} sortByVendible={true}/>
		
		<Recipes_quantity label="Recetas" bind:recipes_quantity={recipes_quantity} sortByVendible={true}/>
	
	</div>

	<TextArea labelText="Descripción" placeholder="Ingrese la descripción del combo..." bind:value={description}/>

	<Button type=submit >Enviar</Button>

</FluidForm>