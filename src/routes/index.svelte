<script>
	import 'carbon-components-svelte/css/white.css';
	import Accounts from '../components/selects/Accounts.svelte';

	let account;
</script>

<Accounts bind:account={account}/>