<script>
  import './global.css'

  import Router from 'svelte-spa-router'

  import Header from './components/Header.svelte'
  import { routes } from './routes'
  import { theme } from './stores/theme'
</script>

<svelte:head>
  <meta name="color-scheme" content={$theme == 'system' ? 'light dark' : $theme} />
  <link rel="stylesheet" href="{$theme}.css" />
</svelte:head>

<div id="warning">
  <p>This application only works on the Ropsten testnet</p>
</div>

<Header />

<Router {routes} />

<style>
  #warning {
    background: #c76b6b;
    font-size: 1em;
    font-weight: bold;
    color: #fff;
    padding: 0.7em;
    text-align: center;
  }
</style>
