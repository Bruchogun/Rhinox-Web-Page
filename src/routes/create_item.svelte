<script>
	import 'carbon-components-svelte/css/white.css';
	import { TextInput, Button, TextArea, FluidForm } from "carbon-components-svelte";
	import Measures from '../components/selects/Measures.svelte';
	import Storages from '../components/selects/Storages.svelte';
	import Suppliers from '../components/selects/Suppliers.svelte';
	import Brands from '../components/selects/Brands.svelte';
	import Products from '../components/selects/Products.svelte';
	import { apiFetch } from '../functions';
    
	let min;
	let mid;
	let top;
	let description;
	let manufacture;
	let brand;
	let supplier;
	let code;
	let cost;
	let price;
	let measure;
	let storage;

	async function add_item(){
		await apiFetch("/api/new_item_product_brand",{
			method: 'POST',
			body: JSON.stringify({
				code: code.value,
				brand: brand.value,
				supplier: supplier.value,
				measure: measure.value,
				storage: storage.value,
				cost,
				price,
				min_stock: min,
				mid_stock: mid,
				max_stock: top,
				description,
				manufacture
			}),
			headers: {'Content-Type': 'application/json'}
		})
		cleanWindows()
	}

	function cleanWindows(){
		description=""
		manufacture=""
		brand=null
		supplier=null
		code=null
		cost=null
		price=null
		measure=null
		storage=null
		min=null
		mid=null
		top=null
	}
</script>

<FluidForm on:submit={add_item}>

<Products bind:product={code} />

<Brands bind:brand={brand} />

<Suppliers bind:supplier={supplier} />

<Measures bind:measure={measure} />

<Storages bind:storage={storage} />

<TextInput type="Number" labelText="Costo" placeholder="Ingrese el monto..." bind:value={cost}/>

<TextInput type="Number" labelText="Precio de Venta" placeholder="Ingrese el monto..." bind:value={price}/>

<TextInput type="Number" labelText="Cantidad mínima de stock" placeholder="Ingrese el monto..." bind:value={min}/>

<TextInput type="Number" labelText="Cantidad media de stock" placeholder="Ingrese el monto..." bind:value={mid}/>

<TextInput type="Number" labelText="Cantidad máxima de stock" placeholder="Ingrese el monto..." bind:value={top}/>

<TextArea labelText="Descripción" placeholder="Ingrese la descripción del artículo..." bind:value={description}/>

<TextArea labelText="Detalles de fabricación" placeholder="Ingrese los detalles de fabricación..." bind:value={manufacture}/>

<Button type=submit >Enviar</Button>

</FluidForm>
