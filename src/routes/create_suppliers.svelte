<script>
	import 'carbon-components-svelte/css/white.css';
	import { FluidForm, TextInput, Button, TextArea } from "carbon-components-svelte";
	import { apiFetch } from '../functions';

let name;
let phone_number1;
let phone_number2;
let phone_number3;
let phone_number4;
let email;
let address;
let description;

	async function create_supplier(){
		await apiFetch ('/api/create_supplier', {
                method: 'POST',
                body: JSON.stringify({
                    name,
					phone_number1,
					phone_number2,
					phone_number3,
					phone_number4,
					email,
					address,
					description
                }),
                headers: {'Content-Type': 'application/json'}
            })
			name = null;
			phone_number1 = null;
			phone_number2 = null;
			phone_number3 = null;
			phone_number4 = null;
			email = null;
			address = "";
			description = "";
	}
</script>

<FluidForm on:submit={create_supplier}>
	<TextInput labelText="Nombre" placeholder="Ingrese el nombre del proveedor..." bind:value={name}/>

	<TextInput labelText="Número celular 1" placeholder="Ingrese un número de contacto..." bind:value={phone_number1}/>

	<TextInput labelText="Número celular 2" placeholder="Ingrese un número de contacto..." bind:value={phone_number2}/>

	<TextInput labelText="Número celular 3" placeholder="Ingrese un número de contacto..." bind:value={phone_number3}/>

	<TextInput labelText="Número celular 4" placeholder="Ingrese un número de contacto..." bind:value={phone_number4}/>

	<TextInput labelText="Correo electrónico" placeholder="Ingrese un email..." bind:value={email}/>

	<TextArea labelText="Dirección" placeholder="Ingrese la dirección" bind:value={address}/>

	<TextArea labelText="Descripción" placeholder="Ingrese la descripción" bind:value={description}/>

	<Button type=submit >Registrar proveedor</Button>
</FluidForm>