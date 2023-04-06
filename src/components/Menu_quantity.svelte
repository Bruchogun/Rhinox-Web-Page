
<script>
    import { TextInput, Button } from 'carbon-components-svelte';
	import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";
    import Menu from './selects/Menu.svelte';

    const NEW_ITEM = {
        item: null,
        quantity: null
    };

    export let menu = [ {...NEW_ITEM} ];
    export let label;

    function addItemrecipe() {
        menu = [ ...menu, {...NEW_ITEM} ]
    }

    function removeUserProfitBuilder(index_to_remove) {
        return ()=>{
            menu = menu.filter((_u, index) => index !== index_to_remove)
        }
    }

    $: menu = menu.map(item_recipe => {
        return {
            ...item_recipe
        }
    })

</script>

<style>
    div {
        margin-bottom: 1em;
    }
    .OnSameLine{
        display: flex;
        justify-content: flex-start;
    }
</style>

<div>
    <h4>{label}</h4>
    {#each menu as menu_item, index}
    
        <div class="OnSameLine">
            <div style="min-width: 10em;">
                <Menu bind:product_to_sell={menu_item.item} />
            </div>

            <TextInput type="number" label="Cantidad" placeholder="Cantidad..." bind:value={menu_item.quantity}/>
        
            <Button kind="danger" hasIconOnly iconDescription="Borrar" icon={TrashCan16} on:click={removeUserProfitBuilder(index)}/>
        </div>
    {/each}
    
    <Button on:click={addItemrecipe}>Agregar artículo</Button>

</div>
