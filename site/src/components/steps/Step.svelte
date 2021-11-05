<script>
  import { getContext } from 'svelte'
  import { STEPS } from './Steps.svelte'

  export let title
  export let action = null

  const { currentStep, register, setAction } = getContext(STEPS)
  const step = { title }
  register(step)

  const regAction = setAction(step)
  $: {
    console.log('action recived', action)
    regAction(action)
  }
</script>

<!-- TODO need to validate that a step is complete -->
{#if $currentStep === step}
  <slot></slot>
{/if}
