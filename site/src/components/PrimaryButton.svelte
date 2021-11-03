<script>
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()
</script>

<button on:click={e => dispatch('click', { nativeEvent: e })}>
  <slot></slot>
</button>

<style>
  button {
    background-color: #637fff;
    background-image: linear-gradient(60deg, #637fff 0%, #918eff 15%, #79aeff 40%, #669bff 80%, #918eff 100%);
    background-size: 200%;
    margin: 0.7em;
    padding: 1em 2em;
    text-align: center;
    transition: 0.5s;
    color: #ffffff;
    border-radius: 1.5em;
    border: none;
    display: block;
  }

  button:hover {
    background-position: right center;
    color: #fff;
    text-decoration: none;
  }

  button:focus {
    border: 1px solid #000;
  }
</style>
