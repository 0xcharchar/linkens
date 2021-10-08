<script>
  import { ethers } from 'ethers'
  import { ENSRegistryWithFallback, Resolver } from '@ensdomains/ens-contracts'

  const env = {
    ENS_REGISTRY_ADDRESS: process.env.ENS_REGISTRY_ADDRESS,
    ENS_NODE: process.env.ENS_NODE,
    ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
    // USER_SUBDOMAIN: '{{ SUBDOMAIN }}',
    USER_SUBDOMAIN: 'mmmonster.ethonline2021char.eth',
  }

  const toGateway = cid => `https://gateway.pinata.cloud/ipfs/${cid}`

  const provider = new ethers.providers.AlchemyProvider('ropsten', env.ALCHEMY_API_KEY)
  const ensRegistry = new ethers.Contract(env.ENS_REGISTRY_ADDRESS, ENSRegistryWithFallback, provider)

  const textTranslate = {
    'com.instagram': {
      handler: h => `https://instagram.com/${h}`,
      pretty: 'Instagram'
    },
    'com.twitter': {
      handler: h => `https://twitter.com/${h.startsWith('@') ? h : '@'+h}`,
      pretty: 'Twitter'
    },
    'com.facebook': {
      handler: h => `https://facebook.com/${h}`,
      pretty: 'Facebook'
    }
  }

  async function loadProfile () {
    const node = ethers.utils.namehash(env.USER_SUBDOMAIN)
    const resolverAddr = await ensRegistry.resolver(node)
    const resolver = new ethers.Contract(resolverAddr, Resolver, provider)

    const socialsRequests = ['com.twitter', 'com.facebook', 'com.instagram'].map(async k => {
      return { type: k, value: await resolver.text(node, k) }
    })

    const links = await Promise.all(socialsRequests)
    const avatar = await resolver.text(node, 'avatar')

    return {
      name: env.USER_SUBDOMAIN.split('.')[0],
      avatar: avatar ? toGateway(avatar) : '',
      links
    }
  }

</script>

<main>
  {#await loadProfile()}
    <p>loading</p>
  {:then profile}
    <section id="banner">
      <div class="avatar">
        {#if profile.avatar !== ''}
          <img src={profile.avatar}>
        {/if}
      </div>
      <h1>{profile.name}</h1>
    </section>

    <section id="body">
      <ul>
        {#each profile.links as link}
          <li>
            <a href={textTranslate[link.type].handler(link.value)}>
              {link.value} on {textTranslate[link.type].pretty}
            </a>
          </li>
        {/each}
      </ul>
    </section>
  {:catch error}
    <p>Failed to load from ENS: {error.message}</p>
  {/await}
</main>

<style>
  .avatar {
    display: block;
    width: 15ch;
    height: 15ch;
    margin: 0 auto;
    border-radius: 50%;
    border: 3px solid #000;
    background: #f5f5f5;
    overflow: hidden;
  }

  img {
    width: 100%;
  }

  #banner {
    padding: 1em 0;
    text-align: center;
    background: #464646;
    color: #f5f5f5;
  }

  ul {
    list-style-type: none;
    padding: 0;
    margin: 1em 0;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  }

  a {
    display: block;
    margin: 0.5em;
    padding: 1em;
    text-align: center;
    background: #f5f5f5;
    border: 3px solid #464646;
    color: #464646;
  }
</style>
