<script>
  import { createEventDispatcher } from 'svelte'
  import PrimaryBtn from './PrimaryButton.svelte'

  const dispatch = createEventDispatcher()

  export let mainBtnText = 'Continue'
  export let hideBackBtn = false

  $: showBackBtn = !hideBackBtn

  function handlePrimary (ev) {
    dispatch('primaryClick', { originalEvent: ev })
  }

  function handleSecondary (ev) {
    dispatch('secondaryClick', { originalEvent: ev })
  }
</script>

<section id="control-buttons">
  <PrimaryBtn on:click={handlePrimary}>{mainBtnText}</PrimaryBtn>

  {#if showBackBtn}
    <button id="back-btn" on:click={handleSecondary}>Go Back</button>
  {/if}
</section>

<style>
  #control-buttons {
    display: flex;
    justify-content: space-around;
    padding: 1em;
    flex-flow: column;
    width: initial;
  }

  #control-buttons button {
    min-width: 15ch;
  }

  #back-btn {
    background: none;
    border: none;
    padding: 0.7em 0;
  }

  @media (min-width:801px) { /* tablet, landscape iPad, lo-res laptops ands desktops */
    #control-buttons {
      margin: 0 auto;
      width: 60ch;
      max-width: 25ch;
    }
  }
</style>
