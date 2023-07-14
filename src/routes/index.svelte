<script>
    import 'carbon-components-svelte/css/white.css';
	import { apiFetch } from '../functions';
    import { onMount, onDestroy } from 'svelte';
    import OrdersBoard from '../components/Orders_board.svelte';

	let wakelock;
	let interval_id;
	let orders;
	onMount(async ()=>{
		({orders} = await apiFetch('/api/orders'));
		interval_id = setInterval(async() => {({orders} = await apiFetch('/api/orders'))}, 30000)

		 ///Screen WakeLock
	 
		 const canWakeLock = () => 'wakeLock' in navigator;
		 async function lockWakeState() {
		 if(!canWakeLock()) return;
		 try {
			 wakelock = await navigator.wakeLock.request();
			 wakelock.addEventListener('release', () => {
			 console.log('Screen Wake State Locked:', !wakelock.released);
			 });
			 console.log('Screen Wake State Locked:', !wakelock.released);
		 } catch(e) {
			 console.error('Failed to lock wake state with reason:', e.message);
		 }
		}
		await lockWakeState();
		return wakelock;
	})
	
	onDestroy(() => {
		clearInterval(interval_id);
		releaseWakeState();
	});
	
	function releaseWakeState() {
		 if(wakelock) wakelock.release();
		 wakelock = null;
	}
	async function refresh_orders(){
		({orders} = await apiFetch('/api/orders'));
	}
	
</script>

{#if orders}
	<OrdersBoard cards={orders} {refresh_orders}/>
{/if}