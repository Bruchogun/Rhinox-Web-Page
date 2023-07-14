
<script>
    import { TextInput, Button } from 'carbon-components-svelte';
	import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";
    import Recipes from './selects/Recipes.svelte';

    const NEW_RECIPE = {
        recipe: null,
        quantity: null
    };

    export let recipes_quantity = [ {...NEW_RECIPE} ];
    export let label;
    export let sortBy = 'default';

    function addRecipeQuantity() {
        recipes_quantity = [ ...recipes_quantity, {...NEW_RECIPE} ]
    }

    function removeUserProfitBuilder(index_to_remove) {
        return ()=>{
            recipes_quantity = recipes_quantity.filter((_u, index) => index !== index_to_remove)
        }
    }

    $: recipes_quantity = recipes_quantity.map(recipe_quantity => {
        return {
            ...recipe_quantity
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
    {#each recipes_quantity as recipe_quantity, index}
    
        <Recipes bind:recipe={recipe_quantity.recipe} bind:sortBy/>
    
        <div class="OnSameLine">
            <TextInput type="number" step={0.01} label="Cantidad" placeholder="Cantidad..." bind:value={recipe_quantity.quantity}/>
        
            <Button kind="danger" hasIconOnly iconDescription="Borrar" icon={TrashCan16} on:click={removeUserProfitBuilder(index)}/>
        </div>
    {/each}
    
    <Button on:click={addRecipeQuantity}>Agregar receta</Button>

</div>
