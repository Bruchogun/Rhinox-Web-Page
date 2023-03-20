<script>
	import 'carbon-components-svelte/css/white.css';
	import { TextInput, Button, TextArea, FluidForm, Tile } from "carbon-components-svelte";
	import { apiFetch } from '../functions';
	// import CombosExtras from '../components/Combos_extras.svelte';
	import Clients from '../components/selects/Clients.svelte';
import Accounts from '../components/selects/Accounts.svelte';

	let combos_extras;
	let order_price;
	let client;
	let prepare_time;
	let account;

	async function create_order(){
		await apiFetch("/api/create_order",{
			method: 'POST',
			body: JSON.stringify({
				combos_extras
			}),
			headers: {'Content-Type': 'application/json'}
		})
	}

	$:if(combos_extras){
		prepare_time = 0;
		combos_extras.forEach(element => {
			prepare_time = prepare_time + Number(element.combo.prepare_time)
		});
	}

	$:console.log(combos_extras);
	$:console.log(order_price);
	$:console.log(client);
</script>

<FluidForm on:submit={create_order}>

<!-- <CombosExtras label="Combos" bind:order_price={order_price} bind:combos_extras={combos_extras}/> -->

{#if prepare_time}

	<Tile>Tiempo de preparación: {prepare_time.toFixed()} minutos</Tile>

{/if}

<Clients bind:client={client}/>

{#if client && prepare_time}

	<Tile>Tiempo total: {(prepare_time + Number(client.delivery_time)).toFixed()} minutos</Tile>

	<Tile>Costo total: {(order_price + Number(client.cost)).toFixed()} COP</Tile>

{/if}	

<Accounts bind:account={account}/>

<Button type=submit >Enviar</Button>

</FluidForm>
