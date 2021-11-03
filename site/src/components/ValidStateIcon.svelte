<script context="module">
  export const States = {
    IDLE: 0,
    SEARCHING: 1,
    VALID: 2,
    INVALID: 3
  }
</script>

<script>
  import LoadingIcon from '@svicons/ionicons-solid/refresh.svelte'
  import CheckmarkIcon from '@svicons/ionicons-solid/checkmark.svelte'
  import AlertIcon from '@svicons/ionicons-solid/alert.svelte'

  export let status = States.IDLE
</script>

{#if status === States.SEARCHING}
  <div class="rotate inlined">
    <LoadingIcon height="1em" width="1em" color="#637fff" />
  </div>
{:else if status === States.VALID}
  <div class="inlined valid">
    <CheckmarkIcon height="1em" width="1em" color="#ffffff" />
  </div>
{:else if status === States.INVALID}
  <div class="inlined invalid">
    <AlertIcon height="1em" width="1em" color="#ffffff" />
  </div>
{:else}
  <!-- do nothing -->
{/if}

<style>
  .inlined {
    display: inline;
    padding: 0.2em;
    border-radius: 0.3em;
  }

  .valid {
    background-color: #3de08f;
  }

  .invalid {
    background-color: #e03d3d;
  }

  .rotate {
    animation: rotation 1s infinite linear;
  }

  @keyframes rotation {
    from { transform: rotate(0deg); }
    to { transform: rotate(359deg); }
  }
</style>
