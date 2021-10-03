<script>
  import { ethers } from 'ethers'
  import { ENSRegistryWithFallback, Resolver } from '@ensdomains/ens-contracts'
  import contentHash from '@ensdomains/content-hash/dist/index.js'

  import PageForm from '../components/PageForm.svelte'
  import SelectSubdomain from '../components/SelectSubdomain.svelte'

  const States = {
    IDLE: 0,
    CHECKING: 1,
    AVAILABLE: 2, 
    UNAVAILABLE: 3,
    SAVING: 4,
  }

  const env = {
    ENS_REGISTRY_ADDRESS: process.env.ENS_REGISTRY_ADDRESS,
    ENS_NODE: process.env.ENS_NODE,
    RESOLVER_ADDRESS: process.env.RESOLVER_ADDRESS,
    DEPLOY_IPFS_ROUTE: process.env.DEPLOY_IPFS_ROUTE,
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  let signer = null
  const ensRegistry = new ethers.Contract(env.ENS_REGISTRY_ADDRESS, ENSRegistryWithFallback, provider)

  let username = ''
  let userProfile
  let status = States.IDLE

  const subdomain = label => `${label}.${env.ENS_NODE}`
  const hasher = node => ethers.utils.namehash(node)

  async function registerSubdomain (label) {
    // TODO call sitemanager contract one day
    if (!signer) {
      // TODO should be in a store
      await provider.send("eth_requestAccounts", [])
      signer = provider.getSigner()
    }

    const ownerAddr = await signer.getAddress()

    const subTx = await ensRegistry.connect(signer).setSubnodeRecord(
      hasher(env.ENS_NODE),
      ethers.utils.id(label),
      ownerAddr,
      env.RESOLVER_ADDRESS,
      0
    )
    await subTx.wait()

    return label
  }

  async function deployPage (label) {
    const { hash } = await fetch(env.DEPLOY_IPFS_ROUTE, {
      method: 'POST',
      body: JSON.stringify({ subdomain: subdomain(label) })
    })

    return { ipfsHash: hash, label }
  }

  async function saveProfile ({ ipfsHash, label }) {
    if (!signer) {
      await provider.send("eth_requestAccounts", [])
      signer = provider.getSigner()
    }

    const node = hasher(subdomain(label))
    const resolverAddr = await ensRegistry.resolver(node)
    const resolver = new ethers.Contract(resolverAddr, Resolver, signer)

    // set contenthash
    const hashSet = resolver.interface.encodeFunctionData(
      'setContenthash',
      [node, `0x${contentHash.fromIpfs(ipfsHash)}`]
    )

    // set all the text fields
    const textSetters = userProfile.links.map(link => {
      let key = ''
      if (link.value.includes('twitter')) key = 'com.twitter'
      else if (link.value.includes('instagram')) key = 'com.instagram'
      else if (link.value.includes('facebook')) key = 'com.facebook'
      else return null

      const urlParts = link.value.split('/')
      const value = urlParts[urlParts.length - 1]

      return resolver.interface.encodeFunctionData('setText', [node, key, value])
    })

    const multiTx = await resolver.multicall([hashSet, ...textSetters])
    const txResult = await multiTx.wait()

    console.log('txresult', txResult)

    return ipfsHash
  }

  function createPage (ev) {
    if (status !== States.AVAILABLE) return

    return registerSubdomain(username)
      .then(deployPage)
      .then(saveProfile)
      .catch(err => console.log('error saving page', err))
  }
</script>

<main>
  <SelectSubdomain {provider} />
  {#if status === States.AVAILABLE}
    <PageForm bind:profile={userProfile} />
    <button on:click={createPage}>Create page</button>
  {/if}
</main>
