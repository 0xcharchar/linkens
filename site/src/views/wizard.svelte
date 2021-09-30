<script>
  import { ethers } from 'ethers'
  import { ENSRegistryWithFallback, Resolver } from '@ensdomains/ens-contracts'

  import PageForm from '../components/PageForm.svelte'

  const States = {
    IDLE: 0,
    CHECKING: 1,
    AVAILABLE: 2, 
    UNAVAILABLE: 3,
    SAVING: 4,
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

    return 'tim.ethonline2021char.eth' // TODO remove

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

  async function storePage () {
    return 'QmUanYrWzHfay6aXochqH8W7sNronSKuDDavByDCsU8wFP' // TODO remove

    const { hash } = await fetch(process.env.DEPLOY_IPFS_ROUTE, {
      method: 'POST',
      body: JSON.stringify({ subdomain })
    })

    return hash
  }

  async function saveProfile (contenthash) {
    if (!signer) {
      await provider.send("eth_requestAccounts", [])
      signer = provider.getSigner()
    }

    const resolverAddr = await ensRegistry.resolver(ethers.utils.namehash(subdomain))
    const resolver = new ethers.Contract(resolverAddr, Resolver, signer)
    console.log(resolver)
    const node = ethers.utils.namehash(subdomain)

    // set contenthash
    const hashSet = resolver.functions.setContenthash(node, ethers.utils.toUtf8Bytes(contenthash)).encodeABI()
    console.log('hashset', hashSet)

    // set all the text fields
    const textSetters = userProfile.links.map(link => {
      let key = ''
      if (link.value.includes('twitter')) key = 'com.twitter'
      else if (link.value.includes('instagram')) key = 'com.instagram'
      else if (link.value.includes('facebook')) key = 'com.facebook'
      else return null

      const urlParts = link.value.split('/')
      const value = urlParts[urlParts.length - 1]

      return resolver.contract.methods.setText(node, key, value).encodeABI()
    })

    console.log('setters', { textSetters })
    return contenthash
  }

  function createPage (ev) {
    if (status !== States.AVAILABLE) return

    return registerSubdomain(username)
      .then(storePage)
      .then(saveProfile)
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
