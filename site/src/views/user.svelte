<script>
  import { temporaryData } from '../stores/ens'

  export let params = {}

  const { id: userId } = params
  const profile = $temporaryData.find(p => p.name.toLowerCase() === userId.toLowerCase())
  console.log(profile)
</script>

<main>
  <section id="banner">
    <h1>{profile.name}</h1>
    <img src={profile.avatar}>
  </section>

  <section id="body">
    <ul>
      {#each profile.links as link}
        <li><a href={link.value}>{link.description}</a></li>
      {/each}
    </ul>
  </section>
</main>
