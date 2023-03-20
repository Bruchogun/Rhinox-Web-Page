
<script>
    import { Button, TextArea, Tile } from 'carbon-components-svelte';
	import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";
    import ItemsCombo from './Ingredients.svelte';
    import Combos from './selects/Combos.svelte';

    const NEW_COMBO = {
        combo: [],
        extras_items: [],
        extras_price: null,
        comments: ""
    };

    export let combos_extras = [ {...NEW_COMBO} ];
    export let label;
    export let order_price;

    function addItemCombo() {
        combos_extras = [ ...combos_extras, {...NEW_COMBO} ]
    }

    function removeUserProfitBuilder(index_to_remove) {
        return ()=>{
            combos_extras = combos_extras.filter((_u, index) => index !== index_to_remove)
        }
    }

    $: combos_extras = combos_extras.map(combo_extras => {
        return {
            ...combo_extras
        }
    })

    $:if(combos_extras){
		order_price = 0;
		combos_extras.forEach(combo_extras => {
			order_price = order_price + Number(combo_extras.combo.price) + Number(combo_extras.extras_price)
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
    {#each combos_extras as combo_extras, index}
    <h4>{label}</h4>
    <div class="OnSameLine">
        <div>
            <Combos bind:combo={combo_extras.combo} />

            <ItemsCombo suggested_price={false} label="Ingredientes extras" on:change={(combo_extras) => {combo_extras.extras_price = 0;}} bind:combo_price={combo_extras.extras_price} bind:items_combo={combo_extras.extras_items}/>
        
            <TextArea labelText="Indicaciones adicionales" placeholder="Ingrese las indicaciones adicionales" bind:value={combo_extras.comments}/>
        </div>
    
            <Button kind="danger" hasIconOnly iconDescription="Borrar" icon={TrashCan16} on:click={removeUserProfitBuilder(index)}/>
            
        </div>
    {/each}
    <Button on:click={addItemCombo}>Agregar combo</Button>
    
    <Tile>Precio del pedido: {order_price.toFixed()}</Tile>
</div>