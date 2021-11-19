<script>
  import { onMount } from 'svelte'
  import { ethers } from 'ethers'

  import './global.css'
  import ThemeSwitcher from './components/ThemeSwitcher.svelte'
  import PrimaryBtn from './components/PrimaryButton.svelte'
  import UserCard from './components/UserCard.svelte'
  import Card from './components/Card.svelte'

  import { theme } from './stores/theme'
  import { connected, connectWallet } from './stores/ethereum'

  export let subdomain = ''

  let menuActive = false
  const [username, ...domain] = subdomain.split('.')

  async function loadProfile () {
    const node = ethers.utils.namehash(subdomain)
    const provider = new ethers.providers.AlchemyProvider(process.env.ETHEREUM_NETWORK_KEY, process.env.ALCHEMY_API_KEY)

    const registryAbi = new ethers.utils.Interface([
      'function recordExists(bytes32 node) external virtual view returns (bool)',
      'function resolver(bytes32 node) external virtual view returns (address)',
    ]);
    const registry = new ethers.Contract('0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e', registryAbi, provider);

    const resolverAddr = await registry.resolver(node);
    const resolverAbi = new ethers.utils.Interface([
      'function text(bytes32 node, string calldata key) external view returns (string memory)',
      'function addr(bytes32 node, uint coinType) external view returns (bytes memory)',
    ]);
    const resolver = new ethers.Contract(resolverAddr, resolverAbi, provider);

    // check if things exist
    const subdomainExists = await registry.recordExists(node);
    if (!subdomainExists) {
      throw new Error('Subdomain does not exist');
    }

    const socialsRequests = ['com.twitter', 'com.facebook', 'com.instagram'].map(async k => {
      return { description: k, value: await resolver.text(node, k) }
    });

    const links = await Promise.all(socialsRequests);
    const avatar = await resolver.text(node, 'avatar');

    return {
      username,
      avatar,
      links
    };
  }

  async function handleConnect () {
    await connectWallet()
    // TODO
    // sign message
    // verify that wallet matches
    // make content editable
  }

  let profile
  onMount(async () => {
    profile = await loadProfile()
  })
</script>

<svelte:head>
  <meta name="color-scheme" content={$theme == 'system' ? 'light dark' : $theme} />
  <link rel="stylesheet" href="/{$theme}.css" />

  <title>{username}'s site on {domain.join('.')}</title>
</svelte:head>

<main>
  {#if !profile}
    <p>Loading</p>
  {:else}
    <UserCard {profile} />
  {/if}
</main>

<button id="menu-button" on:click={() => menuActive = !menuActive}>
  menu
</button>

<nav class:visible={menuActive}>
  <Card>
    <ul>
      <li><PrimaryBtn on:click={handleConnect}>Login</PrimaryBtn></li>
      <li><ThemeSwitcher /></li>
    </ul>
  </Card>
</nav>

<style>
  main {
    padding: 0;
  }

  button {
    position: absolute;
    bottom: 1em;
    right: 1em;
    display: block;
    height: 3em;
    width: 3em;
    background-color: #637fff;
    background-image: linear-gradient(60deg, #637fff 0%, #918eff 15%, #79aeff 40%, #669bff 80%, #918eff 100%);
    background-size: 200%;
    text-align: center;
    transition: 0.5s;
    color: #ffffff;
    border-radius: 50%;
  }

  button:hover {
    background-position: right center;
    color: #fff;
    text-decoration: none;
  }

  nav.visible {
    display: flex;
    flex-direction: column;
  }

  nav {
    display: none;
    position: absolute;
    bottom: 5.4em;
    right: 1em;
    min-width: 10em;
  }

  ul {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    gap: 1em;
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  @media (min-width:801px) { /* tablet, landscape iPad, lo-res laptops ands desktops */
    main {
      margin: 0 auto;
      width: 60ch;
    }
  }
</style>
