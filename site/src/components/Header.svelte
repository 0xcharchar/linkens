<script>
  import Onboard from 'bnc-onboard'
  import { ethers } from 'ethers'

  import { provider, address, connected, ens } from '../stores/ethereum'
  import PrimaryBtn from './PrimaryButton.svelte'
  import Profile from './Profile.svelte'

  const rpcUrl = process.env.ALCHEMY_API_RPC_URL

  const onboard = Onboard({
    dappId: process.env.BLOCKNATIVE_API_KEY,
    networkId: 3,

    subscriptions: {
      address: addressVal => address.set(addressVal || ''),
      ens: ensVal => ens.set(ensVal || {}),
      wallet: wallet => {
        if (!wallet) {
          provider.set(null)
          connected.set(false)
        }

        provider.set(new ethers.providers.Web3Provider(wallet.provider))
        connected.set(true)
      }
    },

    walletSelect: {
      wallets: [
        { walletName: 'metamask' },
        {
          walletName: 'walletConnect',
          infuraKey: process.env.INFURA_PROJECT_ID
        },
        {
          walletName: 'trezor',
          appUrl: 'https://linkens.xyz',
          email: 'team@linkens.xyz',
          rpcUrl
        },
        {
          walletName: 'ledger',
          rpcUrl
        }
      ]
    }
  })

  async function handleConnect () {
    const selected = await onboard.walletSelect()
    if (!selected) return /* TODO show an error */

    const connected = await onboard.walletCheck()
    if (!connected) return /* TODO show an error */
  }
</script>

<header>
  <h1>LinkENS</h1>

  <section>
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>

    {#if $connected}
      <Profile />
    {:else}
      <PrimaryBtn on:click={handleConnect}>Connect</PrimaryBtn>
    {/if}

    <div class="theme-swithcer">
    </div>
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
  }

  li > a:hover {
    text-decoration: underline;
  }
</style>
