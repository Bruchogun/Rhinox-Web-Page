<script>
	import { Button, TextArea, TextInput } from "carbon-components-svelte";
	import 'carbon-components-svelte/css/white.css';
import Accounts from "../components/selects/Accounts.svelte";
	import { apiFetch } from "../functions";

	let amount;
	let account_expense;
	let account_income;
	let description;

	function create_transfer(){

		apiFetch("/api/wire_tranfers",{
			method: 'POST',
			body: JSON.stringify({
				description,
				amount,
				expense: {
					id_account: account_expense.id_account,
					id_currency: account_expense.id_currency
				},
				income: {
					id_account: account_income.id_account,
					id_currency: account_income.id_currency
				}
			}),
			headers: {'Content-Type': 'application/json'}
		})

		cleanWindows()
	}

	function cleanWindows(){
		account_expense=null;
		amount=null;
		account_income=null;
		description="";
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

	.icons{
		font-size: 2rem;
		line-height: 1.3;
		width: 1em;
	}
</style>

<TextInput type="number" step={0.01} labelText="Monto a transferir" placeholder="Ingrese el monto transferir..." bind:value={amount} />

<div class="OnSameLine">
	<div>
		<Accounts orientation="vertical" bind:account={account_expense}/>
	</div>
		<h3 class="icons">➤</h3>
	<div>
		{#if account_expense}
			<Accounts orientation="vertical" id_currency_filter={account_expense.id_currency} bind:account={account_income}/>
		{/if}
	</div>
</div>

<TextArea labelText="Descripción" placeholder="Ingrese la descripción de la transferencia..." bind:value={description}/>

<Button on:click={create_transfer}>Enviar</Button>