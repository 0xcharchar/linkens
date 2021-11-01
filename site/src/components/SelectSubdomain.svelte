<script>
  export let provider = null
  export let active = true

  import { ethers } from 'ethers'
  import { ENSRegistryWithFallback } from '@ensdomains/ens-contracts'
  import uts46 from 'idna-uts46-hx/uts46bundle.min.js'

  import { profile } from '../stores/profile'
  import Card from '../components/Card.svelte'
  import NameDisplay from '../components/NameDisplay.svelte'

  const pipe = (...fns) => x => fns.reduce((v, fn) => fn(v), x)

  const States = {
    IDLE: 0,
    CHECKING: 1,
    AVAILABLE: 2, 
    UNAVAILABLE: 3
  }

  const env = {
    ENS_REGISTRY_ADDRESS: process.env.ENS_REGISTRY_ADDRESS,
    ENS_NODE: process.env.ENS_NODE,
  }
  let status = States.IDLE
  const ensRegistry = new ethers.Contract(env.ENS_REGISTRY_ADDRESS, ENSRegistryWithFallback, provider)
  const usernamePlaceholder = 'your-name'
  let chosenUsername = ''
  let previous = {
    status: States.IDLE,
    username: ''
  }

  $: statusText = Object.keys(States)[status].toLowerCase()

  // check the ENS registry to see if a subdomain is registered
  function checkLabel () {
    status = States.CHECKING
    console.log('chosenusername', $profile.username)

    return ensRegistry.recordExists(ethers.utils.namehash(`${$profile.username}.${env.ENS_NODE}`))
      .then(recordExists => {
        status = !recordExists ? States.AVAILABLE : States.UNAVAILABLE
      })
      .catch(err => {
        status = States.UNAVAILABLE
      })
  }

  const asciiEns = username => uts46.toAscii(username, { transitional: false, useStd3ASCII: true })

  const formatName = pipe(
    (username) => username.replaceAll(/[^a-z0-9]/ig, ''),
    asciiEns
  )

  $: profile.update(current => ({ ...current, username: formatName(chosenUsername) }))
</script>

<section>
  <slot>
    <h2>Choose Your Name</h2>
    <p>Enter in a subdomain to use for your LinkENS profile.</p>
  </slot>

  <!-- TODO when inactive, use plain text because of svelte limitation -->
  <Card>
    <NameDisplay>{$profile.username || formatName(usernamePlaceholder)}</NameDisplay>

    <input type="text" bind:value={chosenUsername} placeholder={usernamePlaceholder} />
    <button on:click={checkLabel}>Check</button>
  </Card>

  <p class:hidden={status === States.IDLE} style="text-transform: capitalize;">{statusText}</p>
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    gap: 2rem;
    margin: 1em;
  }

  h2 {
    margin: 0;
  }

  .hidden {
    visibility: hidden;
  }

  #username-editor {
    display: inline;
    border-bottom: 3px solid #333;
    padding-bottom: 0.1rem;
    font-weight: bold;
  }

  #username-editor:focus {
    font-weight: normal;
  }
</style>
