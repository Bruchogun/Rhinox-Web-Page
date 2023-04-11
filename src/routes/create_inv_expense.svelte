<script>
	import 'carbon-components-svelte/css/white.css';
	import { Button, TextInput, TextArea } from "carbon-components-svelte";
	import { apiFetch } from '../functions';
    import Items from '../components/selects/Items.svelte';

	let quantity;
	let item;
	let description;
	
	async function create_expense(){
		await apiFetch("/api/create_inv_expense",{
			method: 'POST',
			body: JSON.stringify({
				id_item: item.id_item,
				description,
				quantity
			}),headers: {'Content-Type': 'application/json'}
		});
		cleanWindows()
	}

	function cleanWindows(){
		item=null
		quantity=null
		description=""
	}

</script>

<Items bind:item={item}/>

<TextInput type="Number" step={0.01} labelText="Cantidad gastada" placeholder="Ingrese la cantidad gastada..." bind:value={quantity}/>

<TextArea labelText="Descripción" placeholder="Ingrese la descripción del gasto..." bind:value={description}/>

<Button on:click={create_expense}>Enviar</Button>