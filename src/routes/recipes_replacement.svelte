<script>
	import 'carbon-components-svelte/css/white.css';
	import { FluidForm, TextInput, Button } from "carbon-components-svelte";
	import { apiFetch } from '../functions';
    import Recipes from '../components/selects/Recipes.svelte';

	let recipe;
	let quantity;

	async function replace_recipe(){
		await apiFetch ('/api/recipes_replacement', {
                method: 'POST',
                body: JSON.stringify({
                    recipe,
					quantity
                }),
                headers: {'Content-Type': 'application/json'}
            })
			recipe = null;
			quantity = null;
	}
</script>

<FluidForm on:submit={replace_recipe}>
	<Recipes bind:recipe={recipe} sortBy={'noVendible'}/>

	<TextInput type="Number" step={0.01} labelText="Cantidad repuesta" placeholder="Ingrese la cantidad repuesta..." bind:value={quantity}/>
	
	<Button type=submit >Enviar</Button>
</FluidForm>