<script>
	import 'carbon-components-svelte/css/white.css';
	import { FluidForm, TextInput, Button, TextArea } from "carbon-components-svelte";
	import { apiFetch } from '../functions';
	import Ingredients_recipe from '../components/Ingredients_recipe.svelte';

	let name;
	let description;
	let manufacture;
	let recipe_price;
	let items_recipe;
	let prepare_time;

	async function create_recipe(){
		items_recipe = items_recipe.map(object => {
			return ({
				id_item: object.item.id_item,
				quantity: object.quantity
			})
		});
		console.log(items_recipe);
		await apiFetch ('/api/create_recipe', {
                method: 'POST',
                body: JSON.stringify({
                    name,
					recipe_price,
					description,
					manufacture,
					items_recipe,
					prepare_time
                }),
                headers: {'Content-Type': 'application/json'}
            })
			name = null;
			description = "";
			manufacture = "";
			prepare_time = null;
	}

</script>

<FluidForm on:submit={create_recipe}>
	<TextInput labelText="Nombre" placeholder="Ingrese el nombre de la receta..." bind:value={name}/>
	
	<Ingredients_recipe label="Ingredientes" bind:items_recipe={items_recipe}/>

	<TextInput labelText="Precio de la receta" placeholder="Precio..." bind:value={recipe_price}/>

	<TextInput labelText="Tiempo de preparación (minutos)" placeholder="Ingrese el tiempo de preparación en minutos..." bind:value={prepare_time}/>
 
	<TextArea labelText="Descripción" placeholder="Ingrese la descripción..." bind:value={description}/>
	
	<TextArea labelText="Preparación" placeholder="Ingrese las indicaciones de preparación..." bind:value={manufacture}/>

	<Button type=submit >Crear receta</Button>
</FluidForm>