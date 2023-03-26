<script>
	import 'carbon-components-svelte/css/white.css';
	import { TextInput, Button, TextArea } from "carbon-components-svelte";
	import { apiFetch } from '../functions';
	import Accounts from '../components/selects/Accounts.svelte';
	import Measures from '../components/selects/Measures.svelte';

	let account;
	let description;
	let amount;
	let measure;
	let quantity;

	async function create_expense(){
		await apiFetch("/api/create_general_expense",{
			method: 'POST',
			body: JSON.stringify({
				id_account: account.id_account,
				amount,
				description,
				id_measure: measure.value,
				quantity
			}),
			headers: {'Content-Type': 'application/json'}
		})
		amount=null;
		account=null;
		description="";
		quantity=null;
		measure=null;
	}

</script>
<style>
	.OnSameLine{
		display: flex;
		justify-content: space-around;
	}

	.OnSameLine > :global(*){
		width: 100%;
	}
</style>

<TextInput type="Number" labelText="Monto total gastado" placeholder="Ingrese el monto total del gasto..." bind:value={amount}/>

<Accounts orientation="vertical" bind:account={account}/>

<div class="OnSameLine">
	<TextInput type="Number" placeholder="Ingrese la cantidad..." bind:value={quantity}/>
	<Measures bind:measure={measure} />
</div>

<TextArea labelText="Descripción" placeholder="Ingrese la descripción del gasto..." bind:value={description}/>

<Button on:click={create_expense}>Enviar</Button>