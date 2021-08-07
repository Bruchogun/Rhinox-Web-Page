<script>
	import 'carbon-components-svelte/css/white.css';
	import { TextInput, Button } from "carbon-components-svelte";
	import Currency from '../components/selects/Currency.svelte';
	import { apiFetch } from '../functions';
    
	let name;
	let currency;

	async function add_account(){
		await apiFetch("/api/create_account",{
			method: 'POST',
			body: JSON.stringify({
				name,
				id_currency: currency.id_currency
			}),
			headers: {'Content-Type': 'application/json'}
		})
		cleanWindows()
	}

	function cleanWindows(){
		name=null;
	}
</script>

<Currency bind:currency={currency}/>

<TextInput type="Text" labelText="Cuenta" placeholder="Ingrese el nombre..." bind:value={name}/>

<Button on:click={add_account}>Enviar</Button>