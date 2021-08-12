<script>

	export let address;
	/** @type {"vertical" | "horizontal"}*/
	import { onMount } from 'svelte';
	import { apiFetch } from '../../functions';
	import Select from './Select.svelte';
	
	/**
	 * Get client_addresses, If needed
	 */
	let client_addresses;
	onMount(async ()=>{
		({client_addresses} = await apiFetch('/api/client_addresses'));
	})
	
	let client_addressesToList= [];
	$: if (client_addresses) {
		client_addressesToList = client_addresses.map( address => {
			return ({...address,
					value: address.id_client_address, 
					label: `${address.id_client_address} | ${address.name} ${address.last_name} | ${address.address}`,
					id: address.id_client_address
				})
		})
	}

</script>

<Select placeholder="Ingrese la dirección..." bind:selected={address} on:select items={client_addressesToList} isCreatable="true"/>
