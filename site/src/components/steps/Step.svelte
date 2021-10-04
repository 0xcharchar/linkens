<script>
  import { getContext } from 'svelte'
  import { STEPS } from './Steps.svelte'

  export let title

  const step = { title }
  const { registerStep, currentStep } = getContext(STEPS)

  registerStep(step)
</script>

{#if $currentStep === step}
  <slot></slot>
{/if}
