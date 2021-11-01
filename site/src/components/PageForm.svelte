<script>
  import { profile } from '../stores/profile'
  import Card from '../components/Card.svelte'

  let startingLinks = [
    { description: 'Instagram', value: '' },
    { description: 'Twitter', value: '' },
    { description: 'Facebook', value: '' },
  ]

  profile.update(p => ({ ...p, links: startingLinks }))
</script>

<section>
  <h2>Add Your links</h2>
  <p>Add the links you want to appear on your LinkENS profile.</p>

  <Card>
    <h3>{$profile.username}.{process.env.ENS_NODE}</h3>

    <ul>
      <li>
        <label for="avatar-cid">Avatar</label>
        <input id="avatar-cid" type="text" bind:value={$profile.avatar} />
      </li>

      {#each $profile.links as field (field.description)}
        <li>
          <label for="link-{field.description}">{field.description}</label>
          <input id="link-{field.description}" type="text" bind:value={field.value} />
        </li>
      {/each}
    </ul>
  </Card>
</section>

<style>
  section {
    padding: 1em;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }
</style>
