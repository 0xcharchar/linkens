<script>
  import { derived } from 'svelte/store'
  import { createIcon } from '@download/blockies'
  import { address, ens } from '../stores/ethereum'

  const addressTrim = addr => `${addr.slice(0, 5)}...${addr.slice(-4)}`
  const makeBlockie = addr => createIcon({ seed: addr.toLowerCase() }).toDataURL()

  const display = derived([address, ens], ([$address, $ens]) => {
    const name = $ens && $ens.name || addressTrim($address)
    const avatar = $ens && $ens.avatar || makeBlockie($address)
    return { name, avatar }
  }, '') 
</script>

<div id="profile">
  <p>{$display.name}</p>
  <div class="icon" style="background-image: url({$display.avatar})"></div>
</div>

<style>
  #profile {
    margin: 0.7em;
    padding: 1em 2em;
    transition: 0.5s;
    border-radius: 1.5em;
    border: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--color-card-background);
    gap: 1em;
  }

  p {
    margin: 0;
    padding: 0;
  }

  .icon {
    display: block;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-repeat: no-repeat;
    background-position: center center;
  }
</style>
