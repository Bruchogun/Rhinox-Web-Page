<script>
    import 'carbon-components-svelte/css/white.css';
	import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";
    import { Button, ButtonSet } from 'carbon-components-svelte';
	import { apiFetch } from '../functions';
    import { onMount } from 'svelte';

	let orders;
	onMount(async ()=>{
		 ({orders} = await apiFetch('/api/orders'));
	})

	$:console.log(orders);

	function cancel_order(index_card, index_column) {
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
		}
	}

	function change_card_column(index_card, index_column) {
		columns = columns.map((column, x) => {
			if (x === index_column) {
				column.cards.forEach((card, i) => {
					if(i === index_card && (x+1) < columns.length){
						columns[x+1].cards.push(card)
					}
				});
				return {
					...column,
					cards: column.cards.filter((_u, i) => i !== index_card),
				};
			}
			return column;
		});
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

	function set_orders(){
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
				title: `Orden: ${order.id_order}`,
				client: `${order.name} ${order.last_name}`,
				client_numbers: order.phone_number1 && order.phone_code1 === '57' ? `${order.phone_number1}` :
								order.phone_number1 && order.phone_code1 != '57' ? `+${order.phone_code1} ${order.phone_number1}` : 
								order.phone_number2 && order.phone_code2 === '57' ? `${order.phone_number2}` :
								order.phone_number2 && order.phone_code2 != '57' ? `+${order.phone_code1} ${order.phone_number1}` : 'Esto no deberia mostrarse',
				items: combos_recipes_items,
				primaryAction: 'Complete',
				secondaryAction: 'Edit'
			}
		});
	}

	$:if(orders){
		set_orders()
	}
	$:console.log(orders);

	export let columns 
	
	$:if(orders){
		columns = [
		{
			title: 'Nuevas',
			cards: orders
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

	}

	$:if(columns){
		set_title_number()
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
	overflow: hidden;
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
							<div on:click={() => {alert('olis')}} class="kanban-card-header">
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
										<Button size='small' on:click={() => change_card_column(index_card, index_column)}>Done</Button>
									</ButtonSet>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
{/if}

