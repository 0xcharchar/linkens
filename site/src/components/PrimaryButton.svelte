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
    background-image: linear-gradient(60deg, #637fff 0%, #918eff 30%, #79aeff 86%, #669bff 100%);
  }

  button {
    margin: 10px;
    padding: 15px 45px;
    text-align: center;
    transition: 0.5s;
    color: white;            
    box-shadow: 0 0 20px #eee;
    border-radius: 10px;
    display: block;
  }

  button:hover {
    background-position: right center; /* change the direction of the change here */
    color: #fff;
    text-decoration: none;
  }

  button {
    color: #ffffff;
    padding: 1em 2em;
    border-radius: 1.5em;
    border: none;
    text-align: center;
  }
</style>
