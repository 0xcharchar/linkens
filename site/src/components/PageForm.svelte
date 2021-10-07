<script>
  export let profile = [
    { description: 'Instagram', value: '' },
    { description: 'Twitter', value: '' },
    { description: 'Facebook', value: '' },
  ]
</script>

<section>
  <h2>Social media profiles</h2>
  <p>Enter only your name</p>
  <ul>
    {#each profile as field (field.description)}
      <li>
        <label for="link-{field.description}">{field.description}</label>
        <input id="link-{field.description}" type="text" bind:value={field.value} />
      </li>
    {/each}
  </ul>
</section>

<style>
  section {
    padding: 1em;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
