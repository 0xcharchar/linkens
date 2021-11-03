<script>
  import { onMount } from 'svelte'
  import { ethers } from 'ethers'
  import { ENSRegistryWithFallback } from '@ensdomains/ens-contracts'
  import uts46 from 'idna-uts46-hx/uts46bundle.min.js'
  import SearchIcon from '@svicons/ionicons-solid/search.svelte'

  import { profile } from '../stores/profile'
  import Card from '../components/Card.svelte'
  import NameDisplay from '../components/NameDisplay.svelte'
  import StateIcon, { States } from '../components/ValidStateIcon.svelte'

  export let provider = null

  const pipe = (...fns) => x => fns.reduce((v, fn) => fn(v), x)

  const env = {
    ENS_REGISTRY_ADDRESS: process.env.ENS_REGISTRY_ADDRESS,
    ENS_NODE: process.env.ENS_NODE,
  }
  const ensRegistry = new ethers.Contract(env.ENS_REGISTRY_ADDRESS, ENSRegistryWithFallback, provider)
  let inputDelayTimeout
  const usernamePlaceholder = 'your-name'
  let chosenUsername = $profile.username || ''
  let status = States.IDLE
  if (chosenUsername) checkLabel()

  function handleDomainCheck (e) {
    if (inputDelayTimeout) {
      clearTimeout(inputDelayTimeout)
    }

    inputDelayTimeout = setTimeout(checkLabel, 300)
  }

  // check the ENS registry to see if a subdomain is registered
  function checkLabel () {
    if (!$profile.username) {
      status = States.IDLE
      return
    }

    status = States.SEARCHING
    console.log('chosenusername', $profile.username)

    return ensRegistry.recordExists(ethers.utils.namehash(`${$profile.username}.${env.ENS_NODE}`))
      .then(recordExists => {
        status = !recordExists ? States.VALID : States.INVALID
      })
      .catch(err => {
        status = States.INVALID
      })
  }

  const asciiEns = username => uts46.toAscii(username, { transitional: false, useStd3ASCII: true })

  const formatName = pipe(
    (username) => username.replaceAll(/[^a-z0-9]/ig, ''),
    asciiEns
  )

  $: profile.update(current => ({ ...current, username: formatName(chosenUsername) }))

  let usernameField
  onMount(() => {
    usernameField.focus()
  })
</script>

<section>
  <div>
    <slot>
    </slot>
  </div>

  <Card>
    <NameDisplay>{$profile.username || formatName(usernamePlaceholder)}</NameDisplay>

    <div class="subdomain-form">
      <SearchIcon width="1em" color="#e0e0e5" />
      <input type="text" bind:value={chosenUsername} on:input={handleDomainCheck} placeholder={usernamePlaceholder} bind:this={usernameField} />
      <StateIcon {status} />
    </div>
  </Card>
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

  .hidden {
    visibility: hidden;
  }

  .subdomain-form {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    border: 1px solid #f1f1f4;
    padding: 1em;
    border-radius: 1em;
    gap: 1em;
  }

  input {
    flex-grow: 2;
    margin: 0;
    border: none;
    padding: 0;
    border-radius: 0;
    outline: none;
    min-height: 1.5em;
  }

  button {
    margin: 0;
  }
</style>
