<script>
	import 'carbon-components-svelte/css/white.css';
	import { FluidForm, TextInput, Button, PasswordInput, InlineNotification } from "carbon-components-svelte";
	import Login32 from "carbon-icons-svelte/lib/Login32";
	import { goto } from '@sapper/app'
	import { session } from '../stores';
	import { api } from '../functions';

	let username;
	let password;

    async function login(event){
		event.preventDefault();
		const result = await api.post("/api/public/login", {username, password});
		$session = result.session;
        password=null;
    }

 
</script>
	<FluidForm on:submit={login}>
		<TextInput name="username" labelText="Usuario" placeholder="Ingrese su usuario..." bind:value={username}/>
	
		<PasswordInput labelText="Contraseña" placeholder="Ingrese su contraseña..." bind:value={password}/>

		<Button on:click={login} type=submit icon={Login32}>Iniciar sesión</Button>
	</FluidForm>