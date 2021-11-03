<script context="module">
  export const STEPS = {}
</script>

<script>
  import { setContext, onDestroy } from 'svelte'
  import { writable } from 'svelte/store'
  import PrimaryBtn from '../PrimaryButton.svelte'

  let steps = []
  const currentStep = writable(null)

  setContext(STEPS, {
    registerStep: step => {
      steps = [...steps, step]
      currentStep.update(current => current || step)

      onDestroy(() => {
        const idx = steps.indexOf(step)
        steps = [...steps.slice(0, idx), ...items.slice(idx + 1)]
        currentStep.update(current => current === step ? (steps[idx] || steps[steps.length - 1]) : current)
      })
    },

    currentStep
  })

  const nextStep = step => ev => {
    const idx = steps.indexOf(step)
    currentStep.set(steps[idx + 1])
  }

  const previousStep = step => ev => {
    const idx = steps.indexOf(step)
    currentStep.set(steps[idx - 1])
  }

  $: console.log('ct', $currentStep)
</script>

<div class="tabs">
  <div class="container">
    <slot></slot>
  </div>

  <section id="control-buttons">
    {#if steps.indexOf($currentStep) < (steps.length - 1)}
      <PrimaryBtn on:click={nextStep($currentStep)}>Continue</PrimaryBtn>
    {:else}
      <PrimaryBtn>Publish</PrimaryBtn>
    {/if}

    {#if steps.indexOf($currentStep) > 0}
      <button id="back-btn" on:click={previousStep($currentStep)}>Go Back</button>
    {/if}
  </section>
</div>

<style>
  ul {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  li {
    text-align: center;
    padding: 0.5em;
    min-width: 20%;
    height: 15vh;
    background: #dedede;
  }

  .step-text {
    display: none;
  }

  .active {
    flex-grow: 3;
    background: #666;
    color: #ffffff;
  }

  .active .step-text {
    display: block;
  }

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
    .container, #control-buttons {
      margin: 0 auto;
      width: 60ch;
    }

    #control-buttons {
      max-width: 15%;
    }
  }
</style>
