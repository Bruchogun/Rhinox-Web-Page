<script>
	import 'carbon-components-svelte/css/white.css';
	import { TextInput, Button, TextArea, FluidForm, Checkbox  } from "carbon-components-svelte";
	import Measures from '../components/selects/Measures.svelte';
	import Suppliers from '../components/selects/Suppliers.svelte';
	import Brands from '../components/selects/Brands.svelte';
	import Products from '../components/selects/Products.svelte';
	import { apiFetch } from '../functions';
    
	let min;
	let top;
	let description;
	let manufacture;
	let brand;
	let supplier;
	let product;
	let cost;
	let price;
	let measure;
	let checked = true;

	async function add_item(){
		let id_measure;
		if(!measure){
			id_measure = product.id_measure;
		}else{
			id_measure = measure.value;
		}

		if(!description){
			description = "None";
		}
		if(!manufacture){
			manufacture = "None";
		}
		if(!min){
			min = 0;
		}
		if(!top){
			top = 1;
		}
		await apiFetch("/api/new_item",{
			method: 'POST',
			body: JSON.stringify({
				code: product.value,
				brand: brand.label,
				id_supplier: supplier.value,
				id_measure,
				cost,
				price,
				min_stock: min,
				max_stock: top,
				description,
				manufacture,
				is_vendible: checked
			}),
			headers: {'Content-Type': 'application/json'}
		})
		cleanWindows()
	}

	function cleanWindows(){
		description="";
		manufacture="";
		brand=null
		supplier=null
		product=null
		cost=null
		price=null
		measure=null
		min=null
		top=null
	}

</script>

<FluidForm on:submit={add_item}>

	<Products bind:product={product} />

	<Brands bind:brand={brand} />

	<Suppliers bind:supplier={supplier} />

	{#if product && !product.id_product}

	<Measures bind:measure={measure} />

	{/if}

	<TextInput type="Number" labelText="Costo" placeholder="Ingrese el monto..." bind:value={cost}/>

	<TextInput type="Number" labelText="Precio de Venta" placeholder="Ingrese el monto..." bind:value={price}/>

	{#if product && !product.id_product}

		<TextInput type="Number" labelText="Cantidad mínima de stock" placeholder="Ingrese el monto..." bind:value={min}/>

		<TextInput type="Number" labelText="Cantidad máxima de stock" placeholder="Ingrese el monto..." bind:value={top}/>

		<TextArea labelText="Descripción" placeholder="Ingrese la descripción del artículo..." bind:value={description}/>

		<TextArea labelText="Detalles de fabricación" placeholder="Ingrese los detalles de fabricación..." bind:value={manufacture}/>

	{/if}
	
	<Checkbox labelText="Apto para venta" bind:checked />

	<Button type=submit >Enviar</Button>

</FluidForm>
