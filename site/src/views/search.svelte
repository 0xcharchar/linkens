<script>
  import SearchResult from '../components/search-result.svelte'

  let searchResults = [
    {
      name: 'Tim',
      avatar: '/man1.jpeg',
      url: '/user/tim',
      twitter: 'tim973982'
    },
    {
      name: 'Bob',
      avatar: '/man2.jpeg',
      url: '/user/bob',
      twitter: 'bob973982'
    },
    {
      name: 'Alice',
      avatar: '/woman1.jpeg',
      url: '/user/alice',
      twitter: 'alice973982'
    },
    {
      name: 'Janet',
      avatar: '/woman2.jpeg',
      url: '/user/janet',
      twitter: 'janet973982'
    }
  ]
</script>

<main>
  <h1><em>Support</em> your favourite creators</h1>
  <h2>Featured</h2>

  <ul>
    {#each searchResults as profile}
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
