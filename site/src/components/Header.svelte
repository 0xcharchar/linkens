<script>
  import { link } from 'svelte-spa-router'
  import { connected, connectWallet } from '../stores/ethereum'
  import PrimaryBtn from './PrimaryButton.svelte'
  import Profile from './Profile.svelte'
  import ThemeSwitcher from './ThemeSwitcher.svelte'

  async function handleConnect () {
    await connectWallet()
  }
</script>

<header>
  <h1>LinkENS</h1>

  <section>
    <nav>
      <ul>
        <li><a href="/" use:link>Home</a></li>
        <li><a href="/about" use:link>About</a></li>
        <li><a href="/contact" use:link>Contact</a></li>
      </ul>
    </nav>

    {#if $connected}
      <Profile />
    {:else}
      <PrimaryBtn on:click={handleConnect}>Connect</PrimaryBtn>
    {/if}

    <ThemeSwitcher />
  </section>
</header>

<style>
  h1 {
    margin: 0;
    margin-left: 1em;
    color: #637fff;
  }

  @supports (-webkit-background-clip: text) {
    h1 {
      color: transparent;
      background: linear-gradient(60deg, #637fff 0%, #918eff 30%, #79aeff 86%, #669bff 100%);
      -webkit-background-clip: text;
    }
  }

  header {
    padding: 1.5em;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  header > section {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  ul {
    list-style-type: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    margin: 0;
  }

  li {
    display: inline-block;
  }

  li > a {
    display: block;
    padding: 1em 1.5em;
    color: #717379;
    text-decoration: none;
    transition: 0.5s;
  }

  li > a:hover {
    color: #577AFF;
    transition: 0.5s;
  }
</style>
