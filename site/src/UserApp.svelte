<script>
  import './global.css'
  import ThemeSwitcher from './components/ThemeSwitcher.svelte'
  import PrimaryBtn from './components/PrimaryButton.svelte'

  import { theme } from './stores/theme'
  import { connected, connectWallet } from './stores/ethereum'

  export let subdomain = ''

  const [username, ...domain] = subdomain.split('.')

  async function handleConnect () {
    await connectWallet()
    // TODO
    // sign message
    // verify that wallet matches
    // make content editable
  }
</script>

<svelte:head>
  <meta name="color-scheme" content={$theme == 'system' ? 'light dark' : $theme} />
  <link rel="stylesheet" href="/{$theme}.css" />

  <title>{username}'s site on {domain.join('.')}</title>
</svelte:head>

<nav>
  <ul>
    <li><PrimaryBtn on:click={handleConnect}>Login</PrimaryBtn></li>
    <li><ThemeSwitcher /></li>
  </ul>
</nav>

<style>
</style>
