<script>
  import SearchResult from '../components/search-result.svelte'
  import { temporaryData } from '../stores/ens'

  let searchResults = temporaryData
</script>

<main>
  <h1><em>Support</em> your favourite creators</h1>
  <h2>Featured</h2>

  <ul>
    {#each $searchResults as profile}
      <SearchResult profile={profile} />
    {/each}
  </ul>
</main>

<style>
  main {
    padding: 1rem 10rem;
  }

  h1 em {
    font-style: bold;
  }
</style>
