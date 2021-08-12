<script>
	import 'carbon-components-svelte/css/white.css';
	import ClientAddresses from '../components/selects/ClientAddresses.svelte';
	let address;
	$:console.log(address)
</script>

<ClientAddresses bind:address={address}/>