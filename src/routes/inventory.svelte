<script>
    import 'carbon-components-svelte/css/white.css';
	import { onMount } from 'svelte';
    import { DataTable } from "carbon-components-svelte";
	import { apiFetch } from '../functions';

		const headers = [
			{ key: 'code', value: 'Código' }, 
			{ key: 'description', value: 'Descripción' },
			{ key: 'manufacture', value: 'Manufactura' },
			{ key: 'supplier', value: 'Proveedor' },
			{ key: 'price_cost', value: 'Precio Compra' },
			{ key: 'price_sell', value: 'Precio Venta' },
			{ key: 'amount', value: 'Stock' },
			{ key: 'min_stock', value: 'Stock minimo' },
			{ key: 'mid_stock', value: 'Stock medio' },
			{ key: 'max_stock', value: 'Stock máximo' },
        	{ key: 'status', value: 'Estado' }
    ]
	
    let items;
	onMount(async ()=>{
		 items = await apiFetch('/api/items');
	})

	function status(min, mid, max, stock){
		let percent="xd";
		if ( stock <= 0 ){
			percent = "black";
		}else if ( 0 < stock && stock <= min ){
			percent = "red";
		}else if ( min < stock && stock <= mid){
			percent = "yellow";
		}else if ( mid < stock && stock <= max ){
			percent = "green";
		}else if ( stock > max ){
			percent = "blue";
		}
		return percent;
	}

	let rows= [];
	let itemsToList = [];
	$: if (items) {
		let all_items=items.stocks;
		itemsToList = all_items.map(( item ) => {
			return ({id: item.id_stock,
					code: item.products_code,
					description: item.description,
					manufacture: item.manufacture,
					supplier: item.supplier,
					amount: `${Number(item.stocks_quantity).toFixed(2)} ${item.unit}`,
                    price_sell: `$ ${Number(item.price).toFixed(2)}`,
                    price_cost: `$ ${Number(item.cost).toFixed(2)}`,
                    min_stock: `${Number(item.min_stock).toFixed(2)} ${item.unit}`,
                    mid_stock: `${Number(item.mid_stock).toFixed(2)} ${item.unit}`,
                    max_stock: `${Number(item.max_stock).toFixed(2)} ${item.unit}`,
                    status: `${status(Number(item.min_stock), Number(item.mid_stock), Number(item.max_stock), Number(item.stocks_quantity))}`
					})
		})
	}

	$: if (items) {
		rows = itemsToList.concat()
	}
</script>

<style>
	div{
		width: 100%;;
		overflow: auto;
	}

	.red{
		width: 3em;
		height: 1.5em;
		background-color: rgb(255, 0, 0);
	}

	.black{
		width: 3em;
		height: 1.5em;
		background-color: rgb(0, 0, 0);
	}

	.blue{
		width: 3em;
		height: 1.5em;
		background-color: rgb(0, 0, 255);
	}

	.yellow{
		width: 3em;
		height: 1.5em;
		background-color: rgb(255, 255, 0);
	}

	.green{
		width: 3em;
		height: 1.5em;
		background-color: rgb(0, 255, 0);
	}
</style>

	{#if rows.length!=0}
		<h5>
			⬛ Negro: Stock agotado.
		</h5>

		<h5>
			🟥 Rojo: Stock por debajo del mínimo.
		</h5>

		<h5>
			🟨 Amarillo: Stock por debajo del medio.
		</h5>

		<h5>
			🟩 Verde: Stock por debajo del máximo.
		</h5>

		<h5>
			🟦 Azul: Stock por encima del máximo.
		</h5>

		<div>
			<DataTable 
				size="short" 
				title="Control de Inventario"
				sortable {headers} {rows}
				>
				<span slot="cell" let:cell>
					{#if cell.key === 'status' && cell.value === 'black'}
						<div class="black"/>
					{:else if cell.key === 'status' && cell.value === 'red'}
						<div class="red"/>
					{:else if cell.key === 'status' && cell.value === 'yellow'}
						<div class="yellow"/>
					{:else if cell.key === 'status' && cell.value === 'green'}
						<div class="green"/>
					{:else if cell.key === 'status' && cell.value === 'blue'}
						<div class="blue"/>
					{:else}
						{cell.value}
					{/if}
				</span>
			</DataTable>
		</div>

	{/if}