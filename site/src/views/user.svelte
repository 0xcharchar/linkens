<script>
  import UserCard from '../components/UserCard.svelte'
  import { profile } from '../stores/profile'
</script>

<main>
  <UserCard profile={$profile} />
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
