<script>

	export let client;
	/** @type {"vertical" | "horizontal"}*/
	import { onMount } from 'svelte';
	import { apiFetch } from '../../functions';
	import Select from './Select.svelte';
	
	/**
	 * Get clients, If needed
	 */

    let clients = [];
    let clientsToList = [];
	onMount(async ()=>{
		 ({clients} = await apiFetch('/api/clients'));
	})

	$: if (clients.length > 0) {
		clientsToList = clients.map(client => {
			return ({...client, 
				value: client.id_client, 
				label: `${client.name} ${client.last_name} | Tiempo: ${Number(client.delivery_time).toFixed()} minutos | Envío: ${Number(client.cost).toFixed()} COP`})
		})
	}

</script>

<Select placeholder="Clientes..." bind:selected={client} items={clientsToList} />