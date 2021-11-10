<script>
  export let network

  const isNetwork = !!iconDef[network]
</script>

<div id="container">
  {#if isNetwork}
    {network}
  {:else}
    <div id="false-badge"></div>
  {/if}
  <input type="text" />
</div>

<style>
  #container {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

  #false-badge {
    width: 48px;
    height: 48px;
  }

  input {
    border-color: #ccc;
    border-width: 2px;
    margin-left: 0.7em;
  }
</style>
