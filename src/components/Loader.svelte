<script>
	import { Loading } from "carbon-components-svelte";
	import { loadingIsActive } from "../stores";

	let isActive = false;
	let timeout_index;
	let timeout_ms = 1000;

	$: if ($loadingIsActive) {
		timeout_index = setTimeout(() => isActive = true, timeout_ms);
	} else {
		clearTimeout(timeout_index);
		isActive = false;
	}

</script>

<Loading active={isActive} description="Cargando"/>

