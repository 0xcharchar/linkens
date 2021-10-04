<script>
  export let profile = [
    { description: 'Instagram', value: '' },
    { description: 'Twitter', value: '' },
    { description: 'Facebook', value: '' },
  ]
</script>

<ul>
  {#each profile as field}
    <li>
      <label>{field.description}: <input type="text" bind:value={field.value} /></label>
    </li>
  {/each}
</ul>
