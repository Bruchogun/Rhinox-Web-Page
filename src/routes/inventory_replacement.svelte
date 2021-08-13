<script>
	import 'carbon-components-svelte/css/white.css';
	import { TextInput, Button} from "carbon-components-svelte";
	import { apiFetch } from '../functions';
	import Accounts from '../components/selects/Accounts.svelte';
	import Items from '../components/selects/Items.svelte';

	let item;
    let account;
    let quantity;
    let cost;

	async function repalce_inv(){
		await apiFetch("/api/inventory_incomes",{
			method: 'POST',
			body: JSON.stringify({
				id_item: item.id_item,
				id_account: account.id_account,
				quantity,
				cost,
				currency_code: account.code
			}),headers: {'Content-Type': 'application/json'}
		});
		cleanWindows()
	}

	function cleanWindows(){
		item=null
		account=null
		quantity=null
		cost=null
	}

</script>

<Items bind:item={item}/>

<TextInput type="Number" labelText="Cantidad repuesta" placeholder="Ingrese la cantidad repuesta..." bind:value={quantity}/>

<Accounts orientation="vertical" bind:account={account}/>

<TextInput type="Number" labelText="Monto total gastado" placeholder="Ingrese el monto total gastado..." bind:value={cost}/>

<Button on:click={repalce_inv}>Enviar</Button>