<script>
    import 'carbon-components-svelte/css/white.css';
	import { onMount } from 'svelte';
    import { DataTable} from "carbon-components-svelte";
	import { apiFetch } from '../functions';

	let balances = [];
	let rows = [];
	onMount(async ()=>{
		 ({balances} = await apiFetch('/api/balances'));
	})

    //HEADERS
	let headers = [
	{ key: "name", value: "Cuentas"  },
    { key: "balance", value: "Saldo" }
	];

	//ROWS
	$:if(balances){
		rows = balances.map(balance => ({
			id: balance.id_balance,
			balance: `${Number(balance.balance).toFixed(2)} ${balance.symbol}`,
			name: `(${balance.symbol}) ${balance.name}`
		}));
	}
</script>

{#if rows.length!=0}<DataTable size="short" title="Balance de cuentas" sortable {headers} {rows} />{/if}
