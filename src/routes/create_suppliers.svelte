<script>
	import 'carbon-components-svelte/css/white.css';
	import { FluidForm, TextInput, Button, TextArea } from "carbon-components-svelte";
	import { apiFetch } from '../functions';
	import SupplierAddresses from '../components/selects/SupplierAddresses.svelte';
    import Suppliers from '../components/selects/Suppliers.svelte';

	let selected_supplier;
	let phone_number1;
	let phone_number2;
	let phone_code1;
	let phone_code2;
	let email;
	let address;
	let description;

	async function create_supplier(){
		if(!address.address){
			address.address = address.value;
		}
		await apiFetch ('/api/create_supplier', {
                method: 'POST',
                body: JSON.stringify({
                    selected_supplier,
					phone_number1,
					phone_number2,
					phone_code1,
					phone_code2,
					email,
					address,
					description,
					address
                }),
                headers: {'Content-Type': 'application/json'}
            })
			selected_supplier = null;
			phone_number1 = null;
			phone_number2 = null;
			phone_code1 = null;
			phone_code2 = null;
			email = null;
			address = null;
			description = "";
	}
</script>

<style>
	.OnSameLine{
        display: flex;
        justify-content: flex-start;
    }
	.Extension{
		max-width: 6em;
	}
</style>

<FluidForm on:submit={create_supplier}>
	<Suppliers bind:supplier={selected_supplier} />

	{#if selected_supplier && selected_supplier.value === selected_supplier.label}

		<div class="OnSameLine">
			<div class="Extension">
				<TextInput labelText="Extensión" placeholder="57" bind:value={phone_code1}/>
			</div>
			<TextInput labelText="Número celular 1" placeholder="Ingrese un número de contacto..." bind:value={phone_number1}/>
		</div>

		<div class="OnSameLine">
			<div class="Extension">
				<TextInput labelText="Extensión" placeholder="57" bind:value={phone_code2}/>
			</div>
			<TextInput labelText="Número celular 2" placeholder="Ingrese un número de contacto..." bind:value={phone_number2}/>
		</div>

		<TextInput labelText="Correo electrónico" placeholder="Ingrese un email..." bind:value={email}/>

		<TextArea labelText="Descripción" placeholder="Ingrese la descripción" bind:value={description}/>
	{/if}

	<SupplierAddresses bind:address={address}/>

	{#if address && address.value === address.label}
	
		<TextArea labelText="Puntos de referencia" placeholder="Ingrese la puntos de referencia / indicaciones extras" bind:value={address.description}/>

	{/if}
	
	<Button type=submit >Registrar proveedor</Button>
</FluidForm>