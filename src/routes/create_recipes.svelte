<script>
	import 'carbon-components-svelte/css/white.css';
	import { FluidForm, TextInput, Button, TextArea, Checkbox } from "carbon-components-svelte";
	import { apiFetch } from '../functions';
	import Items_quantity from '../components/Items_quantity.svelte';
    import Measures from '../components/selects/Measures.svelte';

	let name;
	let description;
	let manufacture;
	let recipe_price;
	let recipe_cost;
	let items_recipe;
	let items;
	let prepare_time;
	let checked = true;
	let min;
	let max;
	let measure;

	async function create_recipe(){
		items = items_recipe.map(object => {
			return ({
				id_item: object.item.id_item,
				quantity: object.quantity
			})
		});
		await apiFetch ('/api/create_recipe', {
                method: 'POST',
                body: JSON.stringify({
                    name,
					items: items_recipe,
					id_measure: checked ? undefined : measure.value,
					recipe_cost,
					recipe_price,
					time: prepare_time,
					description,
					manufacture,
					checked,
					min_stock: checked ? 0 : min,
					max_stock: checked ? 0 : max
                }),
                headers: {'Content-Type': 'application/json'}
            })
			name = '';
			description = '';
			manufacture = '';
			recipe_price = 0;
			recipe_cost = 0;
			items_recipe = [];
			prepare_time = 0;
			checked = true;
			min = 0;
			max = 0;
			measure = undefined;
	}
</script>

<FluidForm on:submit={create_recipe}>
	<TextInput labelText="Nombre" placeholder="Ingrese el nombre" bind:value={name}/>
	
	<Items_quantity label="Ingredientes" bind:items_recipe={items_recipe} sortByVendible={false}/>

	<Checkbox labelText="Apto para venta" bind:checked />

	{#if !checked}
		<Measures bind:measure={measure} />

		<TextInput type="Number" labelText="Cantidad mínima de stock" placeholder="Ingrese el monto..." bind:value={min}/>

		<TextInput type="Number" labelText="Cantidad máxima de stock" placeholder="Ingrese el monto..." bind:value={max}/>
	{/if}
	
	<TextInput type="Number" labelText="Costo de la receta" placeholder="Costo" bind:value={recipe_cost}/>
	
	<TextInput type="Number" labelText="Precio de la receta" placeholder="Precio" bind:value={recipe_price}/>
	
	<TextInput type="Number" labelText="Tiempo de preparación (minutos)" placeholder="Ingrese el tiempo" bind:value={prepare_time}/>
	
	<TextArea labelText="Descripción" placeholder="Ingrese la descripción" bind:value={description}/>
	
	<TextArea labelText="Preparación" placeholder="Ingrese las indicaciones de preparación" bind:value={manufacture}/>

	<Button type=submit >Crear receta</Button>
</FluidForm>