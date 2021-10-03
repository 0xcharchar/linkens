<script>
  export let provider = null
  export let active = true

  import { ethers } from 'ethers'
  import { ENSRegistryWithFallback } from '@ensdomains/ens-contracts'
  import { createEventDispatcher } from 'svelte'

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
  const usernamePlaceholder = 'your-username'
  let chosenUsername = usernamePlaceholder
  let previous = {
    status: States.IDLE,
    username: ''
  }

  // check the ENS registry to see if a subdomain is registered
  function checkLabel () {
    status = States.CHECKING

    return ensRegistry.recordExists(ethers.utils.namehash(`${chosenUsername}.${env.ENS_NODE}`))
      .then(recordExists => {
        status = !recordExists ? States.AVAILABLE : States.UNAVAILABLE
      })
      .catch(err => {
        status = States.UNAVAILABLE
      })
  }

  function selectAll (ev) {
    previous = {
      status,
      username: chosenUsername
    }

    status = States.IDLE
    if (window.getSelection && document.createRange) {
      const range = document.createRange()
      range.selectNodeContents(ev.currentTarget)
      const sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(range)
    } else if (document.body.createTextRange) {
      const range = document.body.createTextRange()
      range.moveToElementText(ev.currentTarget)
      range.select()
    } else {
      // no safe way to select all because execCommand is deprecated
    }
  }

  function neverEmpty (ev) {
    if (ev.currentTarget.innerHTML === '') {
      chosenUsername = usernamePlaceholder
    }
    if (chosenUsername === previous.username) {
      status = previous.status
    }
  }

  function checkOrContinue (ev) {
    if (status === States.AVAILABLE) {
      // TODO Fire event when user continues
    } else {
      checkLabel()
    }
  }
</script>

<slot>
  <h2>Choose your username</h2>
</slot>

<!-- TODO when inactive, use plain text because of svelte limitation -->
<div>
  <div id="username-box" contenteditable on:blur={neverEmpty} on:focus={selectAll} bind:innerHTML={chosenUsername}></div>.{env.ENS_NODE}
</div>

<button disabled={chosenUsername === usernamePlaceholder} on:click|preventDefault={checkOrContinue}>{status === States.AVAILABLE ? 'Continue' : 'Check'}</button>

<style>
  #username-box {
    display: inline;
  }
</style>
