<script>
    import 'carbon-components-svelte/css/white.css';
    import Orders_cards from '../components/Orders_cards.svelte';

	export let cards;
    export let refresh_orders;
    let columns = ['','',''];

    function set_columns(){
        columns = columns.map((_u, i) =>{
            return{
                title: i === 0 ? 'Nuevas' : i === 1 ? 'En preparación' : 'Listas',
                cards: i === 0 ? cards.filter( card => !card.is_in_process && !card.is_paid && card.is_active && !card.is_done) :
						i === 1 ? cards.filter( card => card.is_in_process && !card.is_paid && card.is_active && !card.is_done) :
						i === 2 ? cards.filter( card => !card.is_in_process && !card.is_paid && card.is_active && card.is_done) : null
            }
        })
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

	async function set_cards(cards){
		cards = cards.filter(card => card.is_active)
		cards = cards.map((card, x) => {
			let combos_fixed = [];
			let recipes_fixed = [];
			let items_fixed = [];
			let combos_recipes_items = [];
			if(card.combos[0].name){
				card.combos.forEach(combo => {
					combos_fixed.push(`${combo.quantity}x ${combo.name}`)
				});
			}
			if(card.recipes[0].name){
				card.recipes.forEach(recipe =>{
					recipes_fixed.push(`${recipe.quantity}x ${recipe.name}`)
				});
			}
			if(card.items[0].name){
				card.items.forEach(item =>{
					items_fixed.push(`${item.quantity}x ${item.name}`)
				});
			}
			combos_recipes_items = combos_fixed.concat(recipes_fixed)
			combos_recipes_items = combos_recipes_items.concat(items_fixed)
	
			return {
				...card,
				title: `Orden: ${card.id_card}`,
				client: `${card.name} ${card.last_name}`,
				client_numbers: card.phone_number1 && card.phone_code1 ? `+${card.phone_code1} ${card.phone_number1}` :
								card.phone_number1 && !card.phone_code1 ? `${card.phone_number1}` : 
								card.phone_number2 && card.phone_code2 ? `+${card.phone_code2} ${card.phone_number2}` :
								card.phone_number2 && !card.phone_code2 ? `${card.phone_number1}` : 'No hay números registrados.',
				items: combos_recipes_items
			}
		});
    }

	$:if(cards){
        set_columns()
		set_cards(cards)
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
</style>

{#if columns}
	<div class="kanban-board">
		{#each columns as column}
			<div class="kanban-column">
				<div class="kanban-column-header">
					<h2>{column.title}</h2>
				</div>
				<div class="kanban-column-body">
					{#each column.cards as card}
						<Orders_cards card = {card} {refresh_orders}/>
					{/each}
				</div>
			</div>
		{/each}
	</div>
{/if}