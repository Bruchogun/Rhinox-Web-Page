<script>
	import 'carbon-components-svelte/css/white.css';
	import { FluidForm, TextInput, Button, TextArea } from "carbon-components-svelte";
	import { apiFetch } from '../functions';
import ClientAddresses from '../components/selects/ClientAddresses.svelte';

	let name;
	let last_name;
	let number1;
	let number2;
	let number3;
	let number4;
	let email;
	let description;
	let address;

	async function create_client(){
		if(!address.address){
			address.address = address.value;
		}
		await apiFetch ('/api/create_client', {
                method: 'POST',
                body: JSON.stringify({
                    name,
					last_name,
					number1,
					number2,
					number3,
					number4,
					email,
					description,
					address
                }),
                headers: {'Content-Type': 'application/json'}
            })
			name = null;
			last_name = null;
			number1 = null;
			number2 = null;
			number3 = null;
			number4 = null;
			email = null;
			description = "";
			address = "";
	}

</script>

<FluidForm on:submit={create_client}>
	<TextInput labelText="Nombres" placeholder="Ingrese los nombres del cliente..." bind:value={name}/>

	<TextInput labelText="Apellidos" placeholder="Ingrese los apellidos del cliente..." bind:value={last_name}/>

	<TextInput labelText="Número celular 1" placeholder="Ingrese un número de contacto..." bind:value={number1}/>

	<TextInput labelText="Número celular 2" placeholder="Ingrese un número de contacto..." bind:value={number2}/>

	<TextInput labelText="Número celular 3" placeholder="Ingrese un número de contacto..." bind:value={number3}/>

	<TextInput labelText="Número celular 4" placeholder="Ingrese un número de contacto..." bind:value={number4}/>

	<TextInput labelText="Correo electrónico" placeholder="Ingrese un email..." bind:value={email}/>

	<TextArea labelText="Descripción" placeholder="Ingrese la descripción" bind:value={description}/>

	<ClientAddresses bind:address={address}/>

	{#if address && address.value === address.label}
	
		<TextArea labelText="Puntos de referencia" placeholder="Ingrese la puntos de referencia / indicaciones extras" bind:value={address.description}/>
	
	{/if}

	<Button type=submit >Crear cliente</Button>
</FluidForm>