<script>
  import { ethers } from 'ethers'
  import { ENSRegistryWithFallback, Resolver } from '@ensdomains/ens-contracts'
  import contentHash from '@ensdomains/content-hash/dist/index.js'

  import PageForm from '../components/PageForm.svelte'
  import SelectSubdomain from '../components/SelectSubdomain.svelte'
  import { Steps, Step } from '../components/steps'

  const env = {
    ENS_REGISTRY_ADDRESS: process.env.ENS_REGISTRY_ADDRESS,
    ENS_NODE: process.env.ENS_NODE,
    RESOLVER_ADDRESS: process.env.RESOLVER_ADDRESS,
    DEPLOY_IPFS_ROUTE: process.env.DEPLOY_IPFS_ROUTE,
    SITE_MANAGER_ADDRESS: process.env.SITE_MANAGER_ADDRESS,
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  let signer = null
  const ensRegistry = new ethers.Contract(env.ENS_REGISTRY_ADDRESS, ENSRegistryWithFallback, provider)

  let username = ''
  let links

  $: userProfile = { username, links }

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

    const subTx = await ensRegistry.connect(signer).subdomainRegister(
      ethers.utils.id(label),
      ownerAddr,
      env.RESOLVER_ADDRESS,
      0
    )
    await subTx.wait()

    return label
  }

  async function deployPage (label) {
    const response  = await fetch(env.DEPLOY_IPFS_ROUTE, {
      method: 'POST',
      body: JSON.stringify({ subdomain: subdomain(label) })
    })

    const { hash } = await response.json()

    return { ipfsHash: hash, label }
  }

  async function saveProfile ({ ipfsHash, label }) {
    if (!signer) {
      await provider.send("eth_requestAccounts", [])
      signer = provider.getSigner()
    }

    console.log('ipfshash', ipfsHash)
    console.log('hashed', contentHash.fromIpfs(ipfsHash))

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
      if (link.description.toLowerCase().includes('twitter')) key = 'com.twitter'
      else if (link.description.toLowerCase().includes('instagram')) key = 'com.instagram'
      else if (link.description.toLowerCase().includes('facebook')) key = 'com.facebook'
      else return null

      return resolver.interface.encodeFunctionData('setText', [node, key, link.value])
    }).filter(link => link !== null)

    const siteManager = new ethers.Contract(env.SITE_MANAGER_ADDRESS, ['function subdomainRegister(bytes32 label, bytes[] calldata data) external returns (bytes[] memory)'], signer)

    console.log('multicalldata', [hashSet, ...textSetters])
    console.log('label', label, ethers.utils.id(label))
    const multiTx = await siteManager.subdomainRegister(ethers.utils.id(label), [hashSet, ...textSetters], { gasLimit: 500000 })
    const txResult = await multiTx.wait()

    console.log('txresult', txResult)

    return ipfsHash
  }

  function createPage (profile) {
    return function (ev) {
      // return registerSubdomain(username)
      return deployPage(username)
        .then(saveProfile)
        .catch(err => console.log('error saving page', err))
    }
  }
</script>

<main>
  <Steps>
    <Step title="Select username" let:slotStep>
      <SelectSubdomain bind:username={username} {provider} />
    </Step>

    <Step title="Fill in social">
      <PageForm bind:profile={links} />
    </Step>

    <Step title="Confirmation">
      <div>
        <h2>{userProfile.username}</h2>
        <ul>
          {#each userProfile.links as link}
            <li>{link.description}: {link.value}</li>
          {/each}
        </ul>
        <button on:click={createPage(userProfile)}>Save</button>
      </div>
    </Step>
  </Steps>
</main>

<style>
  main {
    padding: 1rem;
  }
</style>
