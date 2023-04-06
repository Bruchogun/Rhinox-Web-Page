<script>

	export let address;
	/** @type {"vertical" | "horizontal"}*/
	import { onMount } from 'svelte';
	import { apiFetch } from '../../functions';
	import Select from './Select.svelte';
	
	/**
	 * Get supplier_addresses, If needed
	 */
	let supplier_addresses;
	onMount(async ()=>{
		({supplier_addresses} = await apiFetch('/api/supplier_addresses'));
	})
	
	let supplier_addressesToList= [];
	$: if (supplier_addresses) {
		supplier_addressesToList = supplier_addresses.map( address => {
			return ({...address,
					value: address.id_supplier_address, 
					label: `${address.id_supplier_address} | ${address.address}`,
					id: address.id_supplier_address
				})
		})
	}

</script>

<Select placeholder="Ingrese la dirección..." bind:selected={address} on:select items={supplier_addressesToList} isCreatable="true"/>
