
<script>
    import { TextInput, Button } from 'carbon-components-svelte';
	import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";
    import Items from './selects/Items.svelte';

    const NEW_ITEM = {
        item: null,
        quantity: null
    };

    export let items_recipe = [ {...NEW_ITEM} ];
    export let label;
    export let sortByVendible = false; 

    function addItemrecipe() {
        items_recipe = [ ...items_recipe, {...NEW_ITEM} ]
    }

    function removeUserProfitBuilder(index_to_remove) {
        return ()=>{
            items_recipe = items_recipe.filter((_u, index) => index !== index_to_remove)
        }
    }

    $: items_recipe = items_recipe.map(item_recipe => {
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
    {#each items_recipe as item_recipe, index}
    
        <Items bind:item={item_recipe.item} bind:sortByVendible/>
    
        <div class="OnSameLine">
            <TextInput type="number" label="Cantidad" placeholder="Cantidad..." bind:value={item_recipe.quantity}/>
        
            <Button kind="danger" hasIconOnly iconDescription="Borrar" icon={TrashCan16} on:click={removeUserProfitBuilder(index)}/>
        </div>
    {/each}
    
    <Button on:click={addItemrecipe}>Agregar ingrediente</Button>

</div>
