<script>
    import 'carbon-components-svelte/css/white.css';
	import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";
	import Close32 from "carbon-icons-svelte/lib/Close32";
    import { Button, ButtonSet } from 'carbon-components-svelte';
	import { apiFetch } from '../functions';
    import Accounts from './selects/Accounts.svelte';

	export let card;
	export let refresh_orders;
	let isExpanded;
	let account;
	let card_expanded={};

	async function cancel_order(card) {
		if(confirm("¿Deseas cancelar esta orden?")){
			await apiFetch("/api/update_order_status",{
			method: 'POST',
			body: JSON.stringify({
				order: card,
				is_canceled: true
			}),
			headers: {'Content-Type': 'application/json'}
		})
		}
		refresh_orders();
	}

	async function change_card_column(card) {
		console.log('entro')
		await apiFetch("/api/update_order_status",{
			method: 'POST',
			body: JSON.stringify({
				order: card,
				account
			}),
			headers: {'Content-Type': 'application/json'}
		})
		account = null;
		refresh_orders();
	}

	function toggleExpand(card) {
		if(isExpanded){
			isExpanded = !isExpanded;
		}else{
			isExpanded = !isExpanded;
			card_expanded = card
		}
	}

	function numberWithCommas(x) {
    	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	}

	$:if(card){
		card.contact_number1 = card.phone_code1 ? `+${card.phone_code1} ${card.phone_number1}` : card.phone_number1,
		card.contact_number2 = card.phone_code2 ? `+${card.phone_code2} ${card.phone_number2}` : card.phone_number2,
		card.main_contact_number = card.phone_number1 ? card.contact_number1 : card.contact_number2
	}
</script>

<style>
	:root {
	--primary-color: #171717;
  	--secondary-color: #f3f3f3;
  	--accent-color: #005f8e;
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

<div class="kanban-card">
	<div on:click={() => {toggleExpand(card)}} class="kanban-card-header">
		<h4>{`Orden: ${card.id_order}`}</h4>
	</div>
	<div class="kanban-card-body">
		<p>{`${card.name} ${card.last_name}`}</p>
		<p>{card.main_contact_number}</p>
		<p>Pedido:</p>
		<ul>
			{#if card.combos}
				{#each card.combos as combo}
					{#if combo.quantity}
						<li>{`${combo.quantity}x ${combo.name}`}</li>
					{/if}
				{/each}
			{/if}
			{#if card.recipes}
				{#each card.recipes as recipe}
					{#if recipe.quantity}
						<li>{`${recipe.quantity}x ${recipe.name}`}</li>
					{/if}
				{/each}
			{/if}
			{#if card.items}
				{#each card.items as item}
					{#if item.quantity}
						<li>{`${item.quantity}x ${item.name}`}</li>
					{/if}
				{/each}
			{/if}
		</ul>
		<div class="buttons">
			<ButtonSet>
				<div class="cancel-button">
					<Button size='small' kind="danger" hasIconOnly iconDescription="Cancelar" icon={TrashCan16} on:click={() => cancel_order(card)} tooltipPosition='top' tooltipAlignment='start'/>
				</div>
				<Button size='small' on:click={() => change_card_column(card)}>{(!card.is_in_process && !card.is_paid && card.is_active && !card.is_done) ? 'Comenzar' : (card.is_in_process && !card.is_paid && card.is_active && !card.is_done) ? 'Lista' : 'Entregar'}</Button>
			</ButtonSet>
			{#if !card.is_in_process && !card.is_paid && card.is_active && card.is_done}
				<Accounts bind:account={account} listPlacement='top'/>
			{/if}
		</div>
	</div>
</div>

{#if isExpanded}
	<div class="order">
		<div class="order-overlay">
			<div class="order-popup">
			<div class="order-popup-header">
				<h3>{`Orden: ${card.id_order}`}</h3>
				<div class="cancel-button">
					<Button size='small' kind="danger" hasIconOnly iconDescription="Cerrar" icon={Close32} on:click={toggleExpand} tooltipPosition='top'/>
				</div>	
			</div>
			<div class="order-popup-content">
				<div class="order-popup-details">
				<div>
					<h4>Pedido:</h4>
					<ul style='padding-left: 1rem; max-width: 15rem; font-size: 1rem;'>
						{#if card.combos}
							{#each card.combos as combo}
								{#if combo.quantity}
									<li style='padding-bottom: 0.5rem; padding-top: 0.5rem;'>{`${combo.quantity}x ${combo.name}`}</li>
								{/if}
							{/each}
						{/if}
						{#if card.recipes}
							{#each card.recipes as recipe}
								{#if recipe.quantity}
									<li style='padding-bottom: 0.5rem; padding-top: 0.5rem;'>{`${recipe.quantity}x ${recipe.name}`}</li>
								{/if}
							{/each}
						{/if}
						{#if card.items}
							{#each card.items as item}
								{#if item.quantity}
									<li style='padding-bottom: 0.5rem; padding-top: 0.5rem;'>{`${item.quantity}x ${item.name}`}</li>
								{/if}
							{/each}
						{/if}
					</ul>
				</div>
				<div style='padding-top: 1rem;'>
					<h4>Indicaciones extras:</h4>
					<p style='padding-left: 1rem; max-width: 15rem;'>{card_expanded.order_description}</p>
				</div>
				<div style='padding-top: 1rem;'>
					<h4>Precio total:</h4>
					<p style='padding-left: 1rem;'>{numberWithCommas(Number(card_expanded.price).toFixed(0))} COP</p>
				</div>
				</div>
				<div style='padding-left: 3rem;'>
					<h4>Datos del cliente</h4>
					<div style='padding-left: 1rem;'>
						<ul style='max-width: 15rem; font-size: 1rem;'>
							<li style='padding-bottom: 0.5rem; padding-top: 0.5rem;'>{`${card_expanded.name} ${card_expanded.last_name}`}</li>
							<li style='padding-bottom: 0.5rem; padding-top: 0.5rem; padding-left: 1rem;'>{card_expanded.client_description}</li>
							<li style='padding-bottom: 0.5rem; padding-top: 0.5rem;'>{card_expanded.address}</li>
							<li style='padding-bottom: 0.5rem; padding-top: 0.5rem; padding-left: 1rem;'>{card_expanded.address_description}</li>
							<li style='padding-bottom: 0.5rem; padding-top: 0.5rem;'>{card_expanded.phone_code1 ? `+${card_expanded.phone_code1}` : ''} {card_expanded.phone_number1 ? card_expanded.phone_number1 : ''}</li>
							<li style='padding-bottom: 0.5rem; padding-top: 0.5rem;'>{card_expanded.phone_code2 ? `+${card_expanded.phone_code2}` : ''} {card_expanded.phone_number2 ? card_expanded.phone_number2 : ''}</li>
						</ul>
					</div>
				</div>
			</div>
			</div>
		</div>
	</div>
{/if}