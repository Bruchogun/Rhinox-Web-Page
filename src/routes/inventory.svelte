<script>
    import 'carbon-components-svelte/css/white.css';
	import { onMount } from 'svelte';
    import { DataTable } from "carbon-components-svelte";
	import { apiFetch } from '../functions';

		const headers = [
			{ key: 'code', value: 'Código' }, 
			{ key: 'brand', value: 'Marca' },
			{ key: 'supplier', value: 'Proveedor' },
			{ key: 'price_cost', value: 'Precio Compra' },
			{ key: 'price_sell', value: 'Precio Venta' },
			{ key: 'quantity', value: 'Stock' },
        	{ key: 'status', value: 'Estado' },
			{ key: 'min_stock', value: 'Stock minimo' },
			{ key: 'max_stock', value: 'Stock máximo' }
    	]
		
	const color_gradient = [
		{ h: 120, s: 100, l: 50 },
	]
    let items;
	let percent;
	
	onMount(async ()=>{
		({items} = await apiFetch('/api/items'));
		await set_data_table();
	})

	function status(code){
		percent = 0;
		items.forEach(element => {
			if(element.code === code){
				percent += Number(element.quantity)*100/Number(element.max_stock)
			}
		});
		return percent;
	}

	let rows= [];
	let itemsToList = [];
	 async function set_data_table() {
		itemsToList = items.map(item => {
			return ({id: item.id_item,
					code: item.code,
					description: item.description,
					manufacture: item.manufacture,
					supplier: item.supplier,
					quantity: `${Number(item.quantity).toFixed(2)} ${item.unit}`,
                    price_sell: `$ ${Number(item.price).toFixed(2)}`,
                    price_cost: `$ ${Number(item.cost).toFixed(2)}`,
                    min_stock: `${Number(item.min_stock).toFixed(2)} ${item.unit}`,
                    max_stock: `${Number(item.max_stock).toFixed(2)} ${item.unit}`,
                    status: `${status(item.code)}`,
					brand: item.brand_name
					})
		});

	}

	$: if (items) {
		rows = itemsToList.concat()
	}
</script>

	{#if rows.length!=0}
		<div>
			<DataTable 
				size="short" 
				title="Control de Inventario"
				sortable {headers} {rows}
				>
				<span slot="cell" let:cell>
					{#if cell.key === 'status' && cell.value}
						{#if cell.value < 200}
							<span style="color: hsl({color_gradient[0].h * Number(cell.value)/100}, 100%, 50%); font-size: 1.5em; -webkit-text-stroke: 0.01em black; font-weight: bold;">{Number(cell.value).toFixed(0)}%</span>
						{:else}
							<span style="color: blue; font-size: 1.5em; -webkit-text-stroke: 0.01em black; font-weight: bold;">{Number(cell.value).toFixed(0)}%</span>
						{/if}
					{:else}
						{cell.value}
					{/if}
				</span>
			</DataTable>
		</div>
	{/if}