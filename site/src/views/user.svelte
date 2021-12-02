<script>
  import UserCard from '../components/UserCard.svelte'
  import { profile } from '../stores/profile'

  export let params = {}
</script>

<main>
  <UserCard profile={$profile} />
  <p>Visit your IPFS site at <a target="_blank" href={decodeURIComponent(params.siteUrl)}>{decodeURIComponent(params.siteUrl)}</a></p>
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
