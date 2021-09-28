<script>
  import { ethers } from 'ethers'
  import { ENSRegistryWithFallback, Resolver } from '@ensdomains/ens-contracts'
  import PageForm from '../components/PageForm.svelte'

  const States = {
    IDLE: 0,
    CHECKING: 1,
    AVAILABLE: 2, 
    UNAVAILABLE: 3
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const ensRegistry = new ethers.Contract('0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e', ENSRegistryWithFallback, provider)

  let username = ''
  let userProfile
  let status = States.IDLE

  $: subdomain = `${username}.ethonline2021char.eth` // TODO env var for domain during build pls

  // check the ENS registry to see if a subdomain is registered
  function checkLabel (ev) {
    status = States.CHECKING

    return ensRegistry.recordExists(ethers.utils.namehash(subdomain))
      .then(recordExists => {
        status = !recordExists ? States.AVAILABLE : States.UNAVAILABLE
      })
      .catch(err => {
        status = States.UNAVAILABLE
      })
  }

  async function registerSubdomain (sub) {
  }

  function createPage (ev) {
    if (status !== States.AVAILABLE) return

    // register subdomain
    
    // deploy page to ipfs
    // update text records and contenthash in ENS subdomain
  }
</script>

<main>
  <p>Choose username</p>
  <input type="text" bind:value={username} />
  <button on:click={checkLabel}>Check</button>
  {#if status === States.AVAILABLE}
    <PageForm bind:profile={userProfile} />
    <button on:click={createPage}>Create page</button>
  {/if}
</main>
