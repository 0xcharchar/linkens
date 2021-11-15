<script>
  import { push, replace } from 'svelte-spa-router'
  import { ethers } from 'ethers'
  import { ENSRegistryWithFallback, Resolver } from '@ensdomains/ens-contracts'
  import contentHash from '@ensdomains/content-hash/dist/index.js'

  import NameDisplay from '../components/NameDisplay.svelte'
  import Card from '../components/Card.svelte'
  import FormControls from '../components/FormControls.svelte'
  import FormTitle from '../components/FormTitle.svelte'

  import { profile } from '../stores/profile'
  import { connected, connectWallet, provider } from '../stores/ethereum'

  // Jump back to first page if key data missing
  if (!$profile.username) replace('/')

  function publishBtn (ev) {
    console.log('in confirmation step action')
    if ($connected) {
      createPage($profile)
    } else {
      console.log('need to connect wallet')
      connectWallet()
    }
  }

  function backBtn (ev) {
    push('/socials')
  }

  let signer = null
  let creatingProfile = ''

  provider.subscribe(p => signer = p && p.getSigner() || null)

  console.log('userprofile', $profile)
  const env = {
    ENS_REGISTRY_ADDRESS: process.env.ENS_REGISTRY_ADDRESS,
    ENS_NODE: process.env.ENS_NODE,
    RESOLVER_ADDRESS: process.env.RESOLVER_ADDRESS,
    DEPLOY_IPFS_ROUTE: process.env.DEPLOY_IPFS_ROUTE,
    SITE_MANAGER_ADDRESS: process.env.SITE_MANAGER_ADDRESS,
    MINIMUM_GAS: 280000,
  }


  const subdomain = label => `${label}.${env.ENS_NODE}`
  const hasher = node => ethers.utils.namehash(node)

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
      console.log('No signer?!')
      throw new Error('Missing signer')

      /*
      await provider.send("eth_requestAccounts", [])
      signer = provider.getSigner()
      */
    }

    const ensRegistry = new ethers.Contract(env.ENS_REGISTRY_ADDRESS, ENSRegistryWithFallback, $provider)

    console.log('ipfshash', ipfsHash)
    console.log('hashed', contentHash.fromIpfs(ipfsHash))

    const node = hasher(subdomain(label))
    const resolverAddr = await ensRegistry.resolver(node)
    const resolver = new ethers.Contract(resolverAddr, Resolver, signer)

    function linkSet (link) {
      let key = ''
      if (link.description.toLowerCase().includes('twitter')) key = 'com.twitter'
      else if (link.description.toLowerCase().includes('instagram')) key = 'com.instagram'
      else if (link.description.toLowerCase().includes('facebook')) key = 'com.facebook'
      else return null

      let handle = link.value
      try {
        const socialUrl = new URL(link.value)
        handle = socialUrl.split('/')[0]
      } catch (err) {
        // Probably failed because user supplied handle and not URL
        // Shrug shoulders, move on
      }

      return ['setText', [node, key, handle]]
    }

    const resolverFunctions = [
      ['setContenthash', [node, `0x${contentHash.fromIpfs(ipfsHash)}`]],
      $profile.avatarCid ? ['setText', [node, 'avatar', $profile.avatarCid]] : null,
      ...$profile.links.map(linkSet)
    ].filter(fn => fn !== null)

    const encodedFunctions = resolverFunctions
      .map(([fn, args]) => resolver.interface.encodeFunctionData(fn, args))

    console.log('multicalldata', encodedFunctions)
    console.log('label', label, ethers.utils.id(label))

    const gasEstimate = (await Promise.all(
      resolverFunctions.map(([fn, args]) => resolver.estimateGas[fn](...args))
    )).reduce((acc, val) => acc.add(val), ethers.BigNumber.from(env.MINIMUM_GAS))

    const siteManager = new ethers.Contract(env.SITE_MANAGER_ADDRESS, ['function subdomainRegister(bytes32 label, bytes[] calldata data) external returns (bytes[] memory)'], signer)

    console.log('gasEstimate', gasEstimate, gasEstimate.toString())

    const multiTx = await siteManager.subdomainRegister(
      ethers.utils.id(label),
      encodedFunctions,
      { gasLimit: gasEstimate }
    )
    const txResult = await multiTx.wait()

    console.log('txresult', txResult)

    return ipfsHash
  }

  let pageLink = ''
  const toGateway = cid => `https://dweb.link/ipfs/${cid}`

  function createPage (profileData) {
    return deployPage(profileData.username)
      .then(saveProfile)
      .then(ipfsHash => {
        pageLink = toGateway(ipfsHash)
      })
      .catch(err => {
        console.log('error saving page', err)
      })
  }

  const toGatewayUrl = cid => `https://ipfs.io/ipfs/${cid}`
</script>

<main>
  <section id="confirmation">
    <FormTitle
      title="Confirm Your Links"
      subtitle="Please review your links before publishing your LinkENS website." />

    <div class="avatar">
      <img src={$profile.avatar ? toGatewayUrl($profile.avatar) : ''} />
    </div>

    <Card>
      <div class="spacer"></div>

      <NameDisplay>{$profile.username}</NameDisplay>

      <ul>
        {#each $profile.links as field (field.description)}
          <li>
            <label for="link-{field.description}">{field.description}</label>
            <input disabled="disabled" id="link-{field.description}" type="text" bind:value={field.value} />
          </li>
        {/each}
      </ul>
    </Card>
  </section>

  <FormControls
    mainBtnText={$connected ? 'Publish' : 'Connect'}
    on:primaryClick={publishBtn}
    on:secondaryClick={backBtn} />
</main>

<style>
  main {
    padding: 0;
  }

  @media (min-width:801px) { /* tablet, landscape iPad, lo-res laptops ands desktops */
    main {
      margin: 0 auto;
      width: 60ch;
    }
  }

  section {
    padding: 1em;
  }

  ul {
    list-style-type: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  li {
    margin: 1em 0;
  }

  label {
    margin-bottom: 0.6em;
  }

  input {
    width: 100%;
  }

  .avatar {
    width: 130px;
    height: 130px;
    overflow: hidden;
    margin: 0 auto;
    position: relative;
    bottom: -70px;
    border-radius: 1em;
  }

  .avatar > img {
    width: 120%;
  }

  #confirmation em {
    font-weight: bold;
    font-style: normal;
  }

  #confirmation button {
    display: block;
    margin: 0 auto;
  }

  #status {
    text-align: center;
  }

  .spacer {
    height: 70px;
  }
</style>
