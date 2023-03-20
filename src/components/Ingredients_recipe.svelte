
<script>
    import { TextInput, Button } from 'carbon-components-svelte';
	import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";
    import Items from './selects/Ingredients.svelte';

    const NEW_ITEM = {
        item: [],
        quantity: null
    };

    export let items_combo = [ {...NEW_ITEM} ];
    export let label;
    export let combo_price;

    function addItemCombo() {
        items_combo = [ ...items_combo, {...NEW_ITEM} ]
    }

    function removeUserProfitBuilder(index_to_remove) {
        return ()=>{
            items_combo = items_combo.filter((_u, index) => index !== index_to_remove)
        }
    }

    $: items_combo = items_combo.map(item_combo => {
        return {
            ...item_combo
        }
    })

    function price_combo(){
		combo_price = 0;
		items_combo.forEach(item_combo => {
			combo_price += (Number(item_combo.item.price) * Number(item_combo.quantity));
		});
	}
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
    {#each items_combo as item_combo, index}
        <div class="OnSameLine">
            <Items bind:item={item_combo.item} on:change={price_combo}/>
        
            <TextInput type="number" label="Cantidad" placeholder="Ingrese la cantidad para este combo..." on:change={price_combo} bind:value={item_combo.quantity}/>
        
            <Button kind="danger" hasIconOnly iconDescription="Borrar" icon={TrashCan16} on:click={removeUserProfitBuilder(index)}/>
        </div>
    {/each}
    
    <Button on:click={addItemCombo}>Agregar ingrediente</Button>

</div>
