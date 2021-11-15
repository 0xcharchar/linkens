<script>
  import { onMount } from 'svelte'
  import { ethers } from 'ethers'
  import { ENSRegistryWithFallback } from '@ensdomains/ens-contracts'
  import uts46 from 'idna-uts46-hx/uts46bundle.min.js'
  import SearchIcon from '@svicons/ionicons-solid/search.svelte'
  import { push } from 'svelte-spa-router'

  import FormControls from '../components/FormControls.svelte'
  import FormTitle from '../components/FormTitle.svelte'
  import Card from '../components/Card.svelte'
  import NameDisplay from '../components/NameDisplay.svelte'
  import StateIcon, { States } from '../components/ValidStateIcon.svelte'

  import { profile } from '../stores/profile'

  const pipe = (...fns) => x => fns.reduce((v, fn) => fn(v), x)

  const env = {
    ENS_REGISTRY_ADDRESS: process.env.ENS_REGISTRY_ADDRESS,
    ENS_NODE: process.env.ENS_NODE,
    ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY
  }

  const provider = new ethers.providers.AlchemyProvider('ropsten', env.ALCHEMY_API_KEY)
  const ensRegistry = new ethers.Contract(env.ENS_REGISTRY_ADDRESS, ENSRegistryWithFallback, provider)
  let inputDelayTimeout
  const usernamePlaceholder = 'your-name'
  let chosenUsername = $profile.username || ''
  let status = States.IDLE
  if (chosenUsername) checkLabel()

  let highlightError = false

  function continueClick (ev) {
    if (status === States.VALID) push('/socials')
    else highlightError = true
  }

  function handleDomainCheck (e) {
      highlightError = false
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

<main>
  <div class="container">
    <FormTitle
      title="Choose Your Name"
      subtitle="Enter in a subdomain to use for your LinkENS profile." />

    <Card>
      <NameDisplay>{$profile.username || formatName(usernamePlaceholder)}</NameDisplay>

      <div class:error={highlightError} class="subdomain-form">
        <SearchIcon width="1em" color="#e0e0e5" />

        <input
          type="text"
          bind:value={chosenUsername}
          on:input={handleDomainCheck}
          placeholder={usernamePlaceholder}
          bind:this={usernameField}
          />

        <StateIcon {status} />
      </div>
    </Card>
  </div>

  <FormControls on:primaryClick={continueClick} hideBackBtn=true />
</main>

<style>
  main {
    padding: 0;
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

  .subdomain-form.error {
    border-color: red;
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

  @media (min-width:801px) { /* tablet, landscape iPad, lo-res laptops ands desktops */
    main {
      margin: 0 auto;
      width: 60ch;
    }
  }
</style>
