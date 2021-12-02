<script>
  import { push, replace } from 'svelte-spa-router'
  import { ethers } from 'ethers'
  import { ENSRegistryWithFallback, Resolver } from '@ensdomains/ens-contracts'
  import contentHash from '@ensdomains/content-hash/dist/index.js'

  import NameDisplay from '../components/NameDisplay.svelte'
  import Card from '../components/Card.svelte'
  import FormControls from '../components/FormControls.svelte'
  import FormTitle from '../components/FormTitle.svelte'
  import ValidStateIcon from '../components/ValidStateIcon.svelte'

  import { profile } from '../stores/profile'
  import { connected, connectWallet, provider } from '../stores/ethereum'
  import { toGatewayUrl } from '../lib/transformers'

  // Jump back to first page if key data missing
  if (!$profile.username) replace('/')

  let isPublishing = false

  async function publishBtn (ev) {
    console.log('in confirmation step action')
    isPublishing = true
    if (!$connected) {
      console.log('need to connect wallet')
      await connectWallet()
    }

    createPage($profile)
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
    MINIMUM_GAS: 160000,
  }

  const subdomain = label => `${label}.${env.ENS_NODE}`
  const hasher = node => ethers.utils.namehash(node)

  function linkFormat (link) {
    let key = ''
    if (link.description.toLowerCase().includes('twitter')) key = 'com.twitter'
    else if (link.description.toLowerCase().includes('instagram')) key = 'com.instagram'
    else if (link.description.toLowerCase().includes('facebook')) key = 'com.facebook'
    else return null

    let handle = link.value
    try {
      const socialUrl = new URL(link.value)
      handle = socialUrl.pathname.split('/')[1]
    } catch (err) {
      // Probably failed because user supplied handle and not URL
      // Shrug shoulders, move on
      console.log('Error parsing link', { err, value: link.value })
    }

    return { description: key, value: handle }
  }

  function toResolverTextFn (node) {
    return function (link) {
      return ['setText', [node, link.description, link.value]]
    }
  }

  async function deployPage (profile) {
    const {
      username: label,
      links,
      avatar
    } = profile

    const formattedLinks = links.map(linkFormat).filter(link => link != null)

    const response  = await fetch(env.DEPLOY_IPFS_ROUTE, {
      method: 'POST',
      body: JSON.stringify({
        version: '2.0',
        subdomain: subdomain(label),
        links: formattedLinks,
        avatar
      })
    })

    const { hash } = await response.json()

    return { ipfsHash: hash, label }
  }

  async function saveProfile ({ ipfsHash, label }) {
    if (!signer) {
      console.log('No signer?!')
      throw new Error('Missing signer')
    }

    const ensRegistry = new ethers.Contract(env.ENS_REGISTRY_ADDRESS, ENSRegistryWithFallback, signer)

    console.log('ipfshash', ipfsHash)
    console.log('hashed', contentHash.fromIpfs(ipfsHash))

    const node = hasher(subdomain(label))
    const resolverAddr = await ensRegistry.resolver(node)
    const resolver = new ethers.Contract(resolverAddr, Resolver, signer)

    const resolverFunctions = [
      ['setContenthash', [node, `0x${contentHash.fromIpfs(ipfsHash)}`]],
    ]

    const encodedFunctions = resolverFunctions
      .map(([fn, args]) => resolver.interface.encodeFunctionData(fn, args))

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

  function createPage (profileData) {
    return deployPage(profileData)
      .then(saveProfile)
      .then(ipfsHash => {
        return toGatewayUrl(ipfsHash)
      })
      .then((pageLink) => {
        push(`/user/${encodeURIComponent(pageLink)}`)
      })
      .catch(err => {
        console.log('error saving page', err)
      })
  }
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

  {#if isPublishing}
    <p>Site is publishing <ValidStateIcon status=1 /></p>
  {:else}
    <FormControls
      mainBtnText={$connected ? 'Publish' : 'Connect'}
      on:primaryClick={publishBtn}
      on:secondaryClick={backBtn} />
  {/if}
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
    border: none;
    background-color: var(--color-input-readonly-background);
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
