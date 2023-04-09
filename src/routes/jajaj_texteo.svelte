<!-- Order.svelte -->

<script>
	import 'carbon-components-svelte/css/white.css';

	export let order;
	let isExpanded = false;
	
	function toggleExpand() {
	  isExpanded = !isExpanded;
	}

	
	order = 
		{
			title: 'Task 2',
			description: 'Do another thing',
			items: null,
			primaryAction: 'Complete',
			secondaryAction: 'Edit'
		}
		
  </script>
  
  <div class="order">
	<h3>{order.title}</h3>
	<p>{order.description}</p>
	<button on:click={toggleExpand}>Expand</button>
	{#if isExpanded}
	  <div class="order-expanded">
		<div class="order-expanded-content">
		  <h4>{order.title}</h4>
		  <p>{order.description}</p>
		  <div class="order-expanded-actions">
			<button class="btn btn-primary">Action 1</button>
			<button class="btn btn-secondary">Action 2</button>
		  </div>
		</div>
	  </div>
	{/if}
  </div>
  
  <style>
	.order {
	  border: 1px solid #ccc;
	  padding: 10px;
	  margin-bottom: 10px;
	}
	
	.order-expanded {
	  position: fixed;
	  top: 0;
	  left: 0;
	  width: 100%;
	  height: 100%;
	  background-color: rgba(0, 0, 0, 0.5);
	  display: flex;
	  justify-content: center;
	  align-items: center;
	}
	
	.order-expanded-content {
	  background-color: white;
	  padding: 20px;
	}
	
	.order-expanded-actions {
	  display: flex;
	  justify-content: space-between;
	  margin-top: 20px;
	}
  </style>
  