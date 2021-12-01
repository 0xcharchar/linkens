<script>
  import { ethers } from 'ethers'

  import './global.css'
  import '../public/system.css'
  import UserCard from './components/UserCard.svelte'

  export let profilePromise
  export let domain

</script>

<svelte:head>
  {#await profilePromise then { username }}
    <title>{username}'s site on {domain}</title>
  {/await}
</svelte:head>

<main>
  {#await profilePromise}
    <p>Loading</p>
  {:then profile}
    <UserCard {profile} />
  {/await}
</main>

<style>
  main {
    padding: 0;
  }

  @media (min-width:801px) { /* tablet, landscape iPad, lo-res laptops ands desktops */
    main {
      margin: 0 auto;
      width: 60ch;
    }
  }
</style>
