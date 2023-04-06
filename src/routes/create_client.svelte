<script>
	import 'carbon-components-svelte/css/white.css';
	import { FluidForm, TextInput, Button, TextArea } from "carbon-components-svelte";
	import { apiFetch } from '../functions';
	import ClientAddresses from '../components/selects/ClientAddresses.svelte';
    import Clients from '../components/selects/Clients.svelte';

	let selected_client;
	let last_name;
	let number1;
	let number2;
	let extension1;
	let extension2;
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
                    selected_client,
					last_name,
					number1,
					number2,
					extension1,
					extension2,
					email,
					description,
					address
                }),
                headers: {'Content-Type': 'application/json'}
            })
			selected_client = null;
			last_name = null;
			number1 = null;
			number2 = null;
			extension1 = null;
			extension2 = null;
			email = null;
			description = "";
			address = null;
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

<FluidForm on:submit={create_client}>
	
	<Clients bind:client={selected_client}/>
	
	{#if selected_client && selected_client.value===selected_client.label}
		<TextInput type="Text" labelText="Ingrese los apellidos" bind:value={last_name}/>
		<div class="OnSameLine">
			<div class="Extension">
				<TextInput type="Number" labelText="Extensión" placeholder="57" bind:value={extension1}/>
			</div>
			<TextInput type="Number" labelText="Número celular 1" placeholder="Ingrese un número de contacto..." bind:value={number1}/>
		</div>

		<div class="OnSameLine">
			<div class="Extension">
				<TextInput type="Number" labelText="Extensión" placeholder="57" bind:value={extension2}/>
			</div>
			<TextInput type="Number" labelText="Número celular 2" placeholder="Ingrese un número de contacto..." bind:value={number2}/>
		</div>

		<TextInput labelText="Correo electrónico" placeholder="Ingrese un email..." bind:value={email}/>

		<TextArea labelText="Descripción" placeholder="Ingrese la descripción" bind:value={description}/>
	{/if}

	<ClientAddresses bind:address={address}/>

	{#if address && address.value === address.label}
	
		<TextArea labelText="Puntos de referencia" placeholder="Ingrese indicaciones extras" bind:value={address.description}/>
	
	{/if}

	<Button type=submit >Crear cliente</Button>
</FluidForm>