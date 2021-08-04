<script>

	export let account;
	export let id_currency_filter = null;
	import { onMount } from 'svelte';
	import { apiFetch } from '../../functions';
	import Select from './Select.svelte';
	
	/**
	 * Get accounts, If needed
	 */
	let data = [];
	onMount(async ()=>{
		({data} = await apiFetch('/api/accounts'));
	})

	let accountsToList = [];
	$: if (data.length > 0) {
		accountsToList = data
							.filter(({id_currency})=> id_currency_filter
														? id_currency === id_currency_filter
														: true
							).map((account) => {
								account.value=account.id_account
								account.label= `${account.name} (${account.symbol})`
								return account
							})
	}

</script>

<Select placeholder="Cuentas..." bind:selected={account} items={accountsToList}/>