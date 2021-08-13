<script>
	import 'carbon-components-svelte/css/white.css';
	import { TextInput, Button, TextArea, FluidForm } from "carbon-components-svelte";
	import Measures from '../components/selects/Measures.svelte';
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
	let product;
	let cost;
	let price;
	let measure;

	async function add_item(){
		let id_measure;
		if(!measure){
			id_measure = product.id_measure;
		}else{
			id_measure = measure.value;
		}

		if(!description || !manufacture){
			description = "XD";
			manufacture = "XD";
		}
		await apiFetch("/api/new_item_product_brand",{
			method: 'POST',
			body: JSON.stringify({
				code: product.value,
				brand: brand.label,
				id_supplier: supplier.value,
				id_measure,
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
		description="";
		manufacture="";
		brand=null
		supplier=null
		product=null
		cost=null
		price=null
		measure=null
		min=null
		mid=null
		top=null
	}

	$: console.log(product);
	$: console.log(brand);
	$: console.log(supplier);
	$: console.log(measure);
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

<TextInput type="Number" labelText="Cantidad mínima de stock" placeholder="Ingrese el monto..." bind:value={min}/>

<TextInput type="Number" labelText="Cantidad media de stock" placeholder="Ingrese el monto..." bind:value={mid}/>

<TextInput type="Number" labelText="Cantidad máxima de stock" placeholder="Ingrese el monto..." bind:value={top}/>

{#if product && !product.id_product}

<TextArea labelText="Descripción" placeholder="Ingrese la descripción del artículo..." bind:value={description}/>

<TextArea labelText="Detalles de fabricación" placeholder="Ingrese los detalles de fabricación..." bind:value={manufacture}/>

{/if}

<Button type=submit >Enviar</Button>

</FluidForm>
