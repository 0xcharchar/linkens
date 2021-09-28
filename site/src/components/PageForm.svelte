<script>
  export let profile = {
    links: [
      { description: 'Instagram', value: 'https://instagram.com/' },
      { description: 'Twitter', value: 'https://twitter.com/@' },
      { description: 'Facebook', value: 'https://facebook.com/' },
    ]
  }
</script>

<ul>
  {#each profile.links as field}
    <li>
      <input type="text" bind:value={field.description} />: <input type="text" bind:value={field.value} />
    </li>
  {/each}
</ul>
