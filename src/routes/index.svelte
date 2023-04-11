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















<!-- <script>
    import 'carbon-components-svelte/css/white.css';
	import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";
	import Close32 from "carbon-icons-svelte/lib/Close32";
    import { Button, ButtonSet } from 'carbon-components-svelte';
	import { apiFetch } from '../functions';
    import { onMount, onDestroy } from 'svelte';
    import Accounts from '../components/selects/Accounts.svelte';

	let orders;
	let isExpanded;
	let wakelock;
	let account;
	let interval_id;
	onMount(async ()=>{
		({orders} = await apiFetch('/api/orders'));
		interval_id = setInterval(async() => ({orders} = await apiFetch('/api/orders')), 2000)

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

	async function cancel_order(index_card, index_column) {
		if(confirm("¿Deseas cancelar esta orden?")){
			columns = columns.map((column, x) => {
				if (x === index_column) {
					return {
						...column,
						cards: column.cards.filter((_u, i) => i !== index_card),
					};
				}
				return column;
			});

			apiFetch("/api/update_order_status",{
			method: 'POST',
			body: JSON.stringify({
				order,
				is_canceled: true
			}),
			headers: {'Content-Type': 'application/json'}
		})

		({orders} = await apiFetch('/api/orders'));
		set_orders()
		}
	}

	async function change_card_column(index_card, index_column, order) {
		// columns = columns.map((column, x) => {
		// 	if (x === index_column) {
		// 		column.cards.forEach((card, i) => {
		// 			if(i === index_card && (x+1) < columns.length){
		// 				columns[x+1].cards.push(card)
		// 			}
		// 		});
		// 		return {
		// 			...column,
		// 			cards: column.cards.filter((_u, i) => i !== index_card),
		// 		};
		// 	}
		// 	return column;
		// });

		await apiFetch("/api/update_order_status",{
			method: 'POST',
			body: JSON.stringify({
				order,
				account
			}),
			headers: {'Content-Type': 'application/json'}
		})

		({orders} = await apiFetch('/api/orders'));
		set_orders()
	}

	function set_title_number(){
		columns = columns.map((column, x) => {
			if(x === 0){
				column.title = `${column.cards.length} Nuevas`
			}else if( x=== 1){
				column.title = `${column.cards.length} En preparación`
			}else if( x=== 2){
				column.title = `${column.cards.length} Listas`
			}
			return {
						...column
					};
		})
	}

	async function set_orders(orders){
		orders = orders.filter(order => order.is_active)
		orders = orders.map((order, x) => {
			let combos_fixed = [];
			let recipes_fixed = [];
			let items_fixed = [];
			let combos_recipes_items = [];
			if(order.combos[0].name){
				order.combos.forEach(combo => {
					combos_fixed.push(`${combo.quantity}x ${combo.name}`)
				});
			}
			if(order.recipes[0].name){
				order.recipes.forEach(recipe =>{
					recipes_fixed.push(`${recipe.quantity}x ${recipe.name}`)
				});
			}
			if(order.items[0].name){
				order.items.forEach(item =>{
					items_fixed.push(`${item.quantity}x ${item.name}`)
				});
			}
			combos_recipes_items = combos_fixed.concat(recipes_fixed)
			combos_recipes_items = combos_recipes_items.concat(items_fixed)
	
			return {
				...order,
				title: `Orden: ${order.id_order}`,
				client: `${order.name} ${order.last_name}`,
				client_numbers: order.phone_number1 && order.phone_code1 ? `+${order.phone_code1} ${order.phone_number1}` :
								order.phone_number1 && !order.phone_code1 ? `${order.phone_number1}` : 
								order.phone_number2 && order.phone_code2 ? `+${order.phone_code2} ${order.phone_number2}` :
								order.phone_number2 && !order.phone_code2 ? `${order.phone_number1}` : 'No hay números registrados.',
				items: combos_recipes_items
			}
		});
		columns = [
		{
			title: 'Nuevas',
			cards: []
		},
		{
			title: 'En preparación',
			cards: []
		},
		{
			title: 'Listas',
			cards: []
		}
		];
		columns = columns.map((column)=>{
			return {
				title: column.title,
				cards: column.title === 'Nuevas' ? orders.filter( order => !order.is_in_process && !order.is_paid && order.is_active && !order.is_done) :
						column.title === 'En preparación' ? orders.filter( order => order.is_in_process && !order.is_paid && order.is_active && !order.is_done) :
						column.title === 'Listas' ? orders.filter( order => !order.is_in_process && !order.is_paid && order.is_active && order.is_done) : null
			}
		})
	}

	let columns 
	$:if(orders){
		set_orders(orders)
	}

	$:console.log(orders)

	$:if(columns){
		set_title_number()
	}


	let order={}
	function toggleExpand(card) {
		if(isExpanded){
			isExpanded = !isExpanded;
		}else{
			isExpanded = !isExpanded;
			order = card
		}
	}

	function numberWithCommas(x) {
    	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	}
</script>

<style>
	:root {
	--primary-color: #171717;
  	--secondary-color: #f3f3f3;
  	--accent-color: #005f8e;
	}

	.kanban-board {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 1rem;
	}

	.kanban-column {
	width: 300px;
	background-color: var(--secondary-color);
	border-radius: 10px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.kanban-column-header {
	padding: 1rem;
	background-color: #ffffff;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	border-bottom: 1px solid #e0e0e0;
	}

	.kanban-column-header h2 {
	margin: 0;
	}

	.kanban-column-body {
	padding: 1rem;
	}

	.kanban-card {
	background-color: #ffffff;
	border-radius: 10px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	margin-bottom: 1rem;
	/* overflow: hidden; */
	}

	.kanban-card-header {
	cursor: pointer;
	padding: 0.7rem;
	background-color: var(--secondary-color);
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	border-bottom: 1px solid #e0e0e0;
	border-top: 1px solid #e0e0e0;
	}

	.kanban-card-header h4 {
	margin: 0;
	}

	.kanban-card-body {
	padding: 1rem;
	padding-top: 0.5rem;
	}

	.kanban-card-body p {
	margin: 0;
	}

	.kanban-card-body ul {
	margin: 0;
	padding-left: 1rem;
	padding-bottom: 0.5rem;
	}

	.buttons{
		max-width: 20rem;
	}
	.cancel-button{
		max-width: 2rem;
	}

	.order {
	  border: 1px solid #ccc;
	  padding: 10px;
	  margin-bottom: 10px;
	}
	
	.order-overlay {
	  position: fixed;
	  top: 0;
	  left: 0;
	  width: 100%;
	  height: 100%;
	  background-color: rgba(0, 0, 0, 0.5);
	  display: flex;
	  justify-content: center;
	  align-items: center;
	  z-index: 9999;
	}
	
	.order-popup {
	  background-color: white;
	  padding: 20px;
	  border-radius: 5px;
	  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
	  position: relative;
	}
	
	.order-popup-header {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  margin-bottom: 20px;
	}
	
	.order-popup-content {
	  display: flex;
	  flex-wrap: wrap;
	}
</style>

{#if columns}
	<div class="kanban-board">
		{#each columns as column, index_column}
			<div class="kanban-column">
				<div class="kanban-column-header">
					<h2>{column.title}</h2>
				</div>
				<div class="kanban-column-body">
					{#each column.cards as card, index_card}
						<div class="kanban-card">
							<div on:click={() => {toggleExpand(card)}} class="kanban-card-header">
								<h4>{card.title}</h4>
							</div>
							<div class="kanban-card-body">
								<p>{card.client}</p>
								<p>{card.client_numbers}</p>
								<p>Pedido:</p>
								{#if card.items}
									<ul>
										{#each card.items as item}
											<li>{item}</li>
										{/each}
									</ul>
								{/if}
								<div class="buttons">
									<ButtonSet>
										<div class="cancel-button">
											<Button size='small' kind="danger" hasIconOnly iconDescription="Cancelar" icon={TrashCan16} on:click={() => cancel_order(index_card, index_column)} tooltipPosition='top' tooltipAlignment='start'/>
										</div>
										<Button size='small' on:click={() => change_card_column(index_card, index_column, card)}>{index_column == 0 ? 'Comenzar' : index_column == 1 ? 'Lista' : 'Entregar'}</Button>
									</ButtonSet>
									{#if index_column == 2}
										<Accounts bind:account={account} listPlacement='top'/>
									{/if}
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
{/if}

{#if isExpanded}
	<div class="order">
		<div class="order-overlay">
			<div class="order-popup">
			<div class="order-popup-header">
				<h3>{order.title}</h3>
				<div class="cancel-button">
					<Button size='small' kind="danger" hasIconOnly iconDescription="Cerrar" icon={Close32} on:click={toggleExpand} tooltipPosition='top'/>
				</div>	
			</div>
			<div class="order-popup-content">
				<div class="order-popup-details">
				<div>
					<h4>Pedido:</h4>
					<ul style='padding-left: 1rem; max-width: 15rem; font-size: 1rem;'>
					{#each order.items as item}
						<li style='padding-bottom: 0.5rem; padding-top: 0.5rem;'>{item}</li>
					{/each}
					</ul>
				</div>
				<div style='padding-top: 1rem;'>
					<h4>Indicaciones extras:</h4>
					<p style='padding-left: 1rem; max-width: 15rem;'>{order.order_description}</p>
				</div>
				<div style='padding-top: 1rem;'>
					<h4>Precio total:</h4>
					<p style='padding-left: 1rem;'>{numberWithCommas(Number(order.price).toFixed(0))} COP</p>
				</div>
				</div>
				<div style='padding-left: 3rem;'>
					<h4>Datos del cliente</h4>
					<div style='padding-left: 1rem;'>
						<ul style='max-width: 15rem; font-size: 1rem;'>
							<li style='padding-bottom: 0.5rem; padding-top: 0.5rem;'>{order.client}</li>
							<li style='padding-bottom: 0.5rem; padding-top: 0.5rem; padding-left: 1rem;'>{order.client_description}</li>
							<li style='padding-bottom: 0.5rem; padding-top: 0.5rem;'>{order.address}</li>
							<li style='padding-bottom: 0.5rem; padding-top: 0.5rem; padding-left: 1rem;'>{order.address_description}</li>
							<li style='padding-bottom: 0.5rem; padding-top: 0.5rem;'>{order.phone_code1 ? `+${order.phone_code1}` : ''} {order.phone_number1 ? order.phone_number1 : ''}</li>
							<li style='padding-bottom: 0.5rem; padding-top: 0.5rem;'>{order.phone_code2 ? `+${order.phone_code2}` : ''} {order.phone_number2 ? order.phone_number2 : ''}</li>
						</ul>
					</div>
				</div>
			</div>
			</div>
		</div>
	</div>
{/if} -->