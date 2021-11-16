<script>
  import { push, replace } from 'svelte-spa-router'

  import { profile } from '../stores/profile'
  import Card from '../components/Card.svelte'
  import NameDisplay from '../components/NameDisplay.svelte'
  import FormControls from '../components/FormControls.svelte'
  import FormTitle from '../components/FormTitle.svelte'

  // Jump back to first page if key data missing
  if (!$profile.username) replace('/')

  function continueClick (ev) {
    push('/confirm')
  }

  function backClick (ev) {
    push('/')
  }

  let startingLinks = [
    { description: 'Instagram', value: '' },
    { description: 'Twitter', value: '' },
    { description: 'Facebook', value: '' },
  ]

  // set default values if nothing there yet
  if (!$profile.links || $profile.links.length === 0) {
    profile.update(p => ({ ...p, links: startingLinks }))
  }
</script>

<main>
  <FormTitle
    title="Add Your Links"
    subtitle="Add the links you want to appear on your LinkENS profile." />

  <Card>
    <NameDisplay>{$profile.username}</NameDisplay>

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

  <FormControls on:primaryClick={continueClick} on:secondaryClick={backClick} />
</main>

<style>
  main {
    padding: 0;
  }

  ul {
    list-style-type: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  li {
    margin: 1em 0;
  }

  label {
    margin-bottom: 0.6em;
  }

  input {
    width: 100%;
    border: none;
    background-color: var(--color-input-background);
  }

  @media (min-width:801px) { /* tablet, landscape iPad, lo-res laptops ands desktops */
    main {
      margin: 0 auto;
      width: 60ch;
    }
  }
</style>
