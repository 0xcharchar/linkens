<script>
  import { ethers } from 'ethers'
  import { ENSRegistryWithFallback, Resolver } from '@ensdomains/ens-contracts'
  import * as IPFS from 'ipfs'

  import PageForm from '../components/PageForm.svelte'
  import { page } from '../userpage'

  const States = {
    IDLE: 0,
    CHECKING: 1,
    AVAILABLE: 2, 
    UNAVAILABLE: 3
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  let signer = null
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

  async function registerSubdomain (label) {
    // TODO call sitemanager contract one day
    if (!signer) {
      await provider.send("eth_requestAccounts", [])
      signer = provider.getSigner()
    }

    const ownerAddr = await signer.getAddress()
    console.log('owner', ownerAddr)

    const subTx = await ensRegistry.connect(signer).setSubnodeRecord(
      ethers.utils.namehash('ethonline2021char.eth'),
      ethers.utils.id(label),
      ownerAddr,
      '0x42D63ae25990889E35F215bC95884039Ba354115',
      0
    )
    await subTx.wait()

    return subdomain
  }

  async function storePage (data) {
    const ipfs = await IPFS.create()

    const added = await ipfs.create({
      path: 'index.html',
      content: data
    })

    return added.cid
  }

  function createPage (ev) {
    if (status !== States.AVAILABLE) return

    return registerSubdomain(username)
      .then(userDomain => Promise.resolve(page(userDomain)))
      .then(storePage)
      .then(cid => console.log('cid is', cid))
      .catch(err => console.log('error saving page', err))
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
