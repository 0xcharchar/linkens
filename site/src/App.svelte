<script>
  import Router from 'svelte-spa-router'
  import { routes } from './routes'

	export let name;
</script>

<Router {routes} />
