<script context="module">
  export const STEPS = {}
</script>

<script>
  import { setContext, onDestroy } from 'svelte'
  import { writable } from 'svelte/store'

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
  <ul>
    {#each steps as step}
      <li>{step.title}</li>
    {/each}
  </ul>

  <slot></slot>

  <button disabled={steps.indexOf($currentStep) === 0} on:click={previousStep($currentStep)}>Previous</button>
  <button disabled={steps.indexOf($currentStep) === steps.length - 1} on:click={nextStep($currentStep)}>Next</button>
</div>
