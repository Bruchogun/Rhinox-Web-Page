<script>
	import 'carbon-components-svelte/css/white.css';
	import { FluidForm, TextInput, Button, TextArea } from "carbon-components-svelte";
	import { apiFetch } from '../functions';

	let name;
	let description;
	let location;

	async function create_storage(){
		await apiFetch ('/api/create_storage', {
                method: 'POST',
                body: JSON.stringify({
                    name,
					description,
					location
                }),
                headers: {'Content-Type': 'application/json'}
            })
			name = null;
			description = "";
			location = "";
	}
</script>

<FluidForm on:submit={create_storage}>
	<TextInput type="Text" labelText="Almacén" placeholder="Ingrese el nombre..." bind:value={name}/>

	<TextArea labelText="Descripción" placeholder="Ingrese la descripción del almacén..." bind:value={description}/>

	<TextArea labelText="Localización" placeholder="Ingrese la localización del almacén..." bind:value={location}/>

	<Button type=submit >Crear almacén</Button>
</FluidForm>