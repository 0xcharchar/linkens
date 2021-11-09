<script>
  import { ethers } from 'ethers'
  import { onMount } from 'svelte'

  import PageForm from '../components/PageForm.svelte'
  import SelectSubdomain from '../components/SelectSubdomain.svelte'
  import Confirmation from '../components/Confirmation.svelte'
  import { Steps, Step } from '../components/steps'

  const provider = new ethers.providers.Web3Provider(window.ethereum)

  let confirmation
  $: confirmationAction = (confirmation && confirmation.stepAction) || null
</script>

<main>
  <Steps>
    <Step title="Select username">
      <SelectSubdomain {provider}>
        <h2>Choose Your Name</h2>
        <p class="subtitle">Enter in a subdomain to use for your LinkENS profile.</p>
      </SelectSubdomain>
    </Step>

    <Step title="Fill in social">
      <PageForm>
        <h2>Add Your links</h2>
        <p class="subtitle">Add the links you want to appear on your LinkENS profile.</p>
      </PageForm>
    </Step>

    <Step title="Confirmation" action={confirmationAction}>
      <Confirmation bind:this={confirmation} {provider}>
        <h2>Confirm Your Links</h2>
        <p class="subtitle">Please review your links before publishing your LinkENS website.</p>
      </Confirmation>
    </Step>
  </Steps>
</main>

<style>
  main {
    padding: 0;
  }

  h2 {
    margin: 0;
    text-align: center;
  }

  p.subtitle {
    text-align: center;
  }

  @media (min-width:801px) { /* tablet, landscape iPad, lo-res laptops ands desktops */
  }
</style>
