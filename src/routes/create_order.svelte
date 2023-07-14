<script>
	import 'carbon-components-svelte/css/white.css';
	import { TextInput, Button, TextArea, FluidForm, Checkbox } from "carbon-components-svelte";
	import { apiFetch } from '../functions';
	import Clients from '../components/selects/Clients.svelte';
	import Menu_quantity from '../components/Menu_quantity.svelte';
    import ClientAddresses from '../components/selects/ClientAddresses.svelte';

	let client;
	let items;
	let description;
	let address;
	let checked = false;
	let price;
	let stocks;

	async function create_order(){
		await apiFetch("/api/create_order",{
			method: 'POST',
			body: JSON.stringify({
				client,
				items,
				description,
				address,
				price
			}),
			headers: {'Content-Type': 'application/json'}
		})

		console.log(orders)
		client = null;
		items = [];
		description = '';
		address = null;
		price = null;
	}

	function set_price(){
		price = 0;
		items.forEach(item => {
			if(item.item && item.quantity){
				price += Number(item.item.price) * Number(item.quantity);
			}
		});
	}

	async function check_stocks(){
		({stocks} = await apiFetch('/api/recip_stocks'));
	}

	$:if(items){
		set_price()
		console.log(items)
	}


</script>

<FluidForm on:submit={create_order}>

	<Clients bind:client={client} _IsCreatable={false}/>

	{#if client}
		<ClientAddresses bind:address={address} _IsCreatable={false} id_client={ client ? client.id_client : null}/>
	{/if}

	<Menu_quantity label="Menú"  bind:menu={items} />

	<TextInput disabled={!checked} type="Number" step={0.01} labelText="Precio de la orden" bind:value={price}/>
	
	<Checkbox labelText="Cambiar precio" bind:checked />

	<TextArea labelText="Instrucciones" placeholder="Indicaciones adicionales..." bind:value={description}/>
	
	<Button type=submit >Enviar</Button>
	
</FluidForm>
