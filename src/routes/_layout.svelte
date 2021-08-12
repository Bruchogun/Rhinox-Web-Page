<script>
	import Logout32 from "carbon-icons-svelte/lib/Logout32";
	import { onMount } from 'svelte';
	import { session, notifications, loadingIsActive } from '../stores';
	import { checkPermissions } from '../functions';
	import { goto } from '@sapper/app'
	import {ADMIN_EXPENSES_CREATE,
			EXCHANGE_CURRENCY_CREATE,
			GENERAL_EXPENSES_CREATE,
			INV_ODT_EXPENSES_CREATE,
			INV_PURCHASES_CREATE,
			ODT_CREATE,
			ODT_UPDATE,
			STOCKS_CREATE,
			STOCKS_READ,
			STORAGES_CREATE,
			USERS_CREATE,
			PRESIDENT,
			ODT_READ,
			USERS_READ
		} from '../constants/PERMISSIONS';

	import {
			Header,
			HeaderUtilities,
			HeaderAction,
			HeaderGlobalAction,
			HeaderPanelLinks,
			HeaderPanelDivider,
			HeaderPanelLink,
			SideNav,
			SideNavItems,
			SideNavMenu,
			SideNavMenuItem,
			SideNavLink,
			SkipToContent,
			Content,
			InlineNotification,
			ToastNotification,
		} from "carbon-components-svelte";
	import Loader from "../components/Loader.svelte";

	function logout(){
		fetch("/api/user", {
			method: "DELETE"
		});
		$session = null;
		goto("/");
	}

	onMount(async ()=>{
		const response = await fetch("/api/user");
		const result = await response.json();
		$session = result.session;
	})

	$: user_permissions = ($session && $session.permissions) || [];

  
	let isSideNavOpen = false;
	let isOpen = false;

</script>

<style>
	.notifications{
		position: fixed;
		display: flex;
		flex-direction: column-reverse;
		bottom: 0;
		right: 0;
		
	}
</style>
  
  <Header company="Rhinox" platformName="Página Web" bind:isSideNavOpen >

	<div slot="skip-to-content">
	  <SkipToContent/>
	</div>

	<HeaderUtilities>
		
		{#if $session}
			<HeaderAction bind:isOpen >
	
			<HeaderPanelLinks >
	
				<HeaderPanelDivider>Preferencias de Usuario</HeaderPanelDivider>
				<HeaderPanelLink href="change_password">Cambiar contraseña</HeaderPanelLink>
	
			</HeaderPanelLinks>
	
			</HeaderAction>
			
			<HeaderGlobalAction on:click={logout} aria-label="Settings" iconDescription="Cerrar sesión" icon={Logout32}/>
		{/if}

		</HeaderUtilities>

  </Header>

  
  <SideNav bind:isOpen={isSideNavOpen}>

	<SideNavItems>
		{#if !$session}
			<SideNavLink href="login" text="Inicio de sesión" />
		{:else}

			<SideNavMenu text="Gestión de usuarios">
				<SideNavMenuItem href="signup" text="Crear usuario" />
				<SideNavMenuItem href="create_client" text="Crear cliente" />
			</SideNavMenu>

			<SideNavMenu text="Gestión monetaria">
				<SideNavMenuItem href="create_general_expense" text="Gastos generales"/>
				<SideNavMenuItem href="create_account" text="Crear cuenta bancaria"/>
				<SideNavMenuItem href="wire_transfer" text="Transferencias"/>
				<SideNavMenuItem href="balances" text="Balance"/>
			</SideNavMenu>

			<SideNavMenu text="Gestión de inventario">
				<SideNavMenuItem href="inventory" text="Control de inventario"/>
				<SideNavMenuItem href="inventory_replacement" text="Reposicion de Inventario"/>
				<SideNavMenuItem href="create_item" text="Ingreso de inventario"/>
				<SideNavMenuItem href="create_suppliers" text="Registrar proveedor"/>
			</SideNavMenu>
			
		{/if}
	</SideNavItems>
	
  </SideNav>
  
  <Content>
	  <slot></slot>
  </Content>

<div class="notifications">
	{#each $notifications as notification, index (index)}
		{#if notification}
			{#if notification.caption}
				<ToastNotification {...notification}/>
			{:else}
				<InlineNotification {...notification}/>
			{/if}
		{/if}
	{/each}
	<!-- {#if $notifications}<ToastNotification {...$notifications} /> {/if} -->
</div>

<Loader></Loader>
