<script>
  import { toGatewayUrl } from '../lib/transformers'
  import Card from './Card.svelte'
  import NameDisplay from './NameDisplay.svelte'
  import LinkWrap from './LinkWrap.svelte'

  export let profile = {
    username: '',
    avatar: '',
    links: []
  }

  const toUrl = user => `https://${user}.${process.env.ENS_NODE}.link`

  $: console.log('profile', profile)
</script>

<div class="avatar">
  <img alt="{profile.username}'s chosen avatar" src={profile.avatar ? toGatewayUrl(profile.avatar) : ''} />
</div>

<Card>
  <div class="spacer"></div>

  <LinkWrap url={toUrl(profile.username)}>
    <NameDisplay>{profile.username}</NameDisplay>
  </LinkWrap>

  <ul>
    {#each profile.links as field (field.description)}
      <li>
        <label for="link-{field.description}">{field.description}</label>
        <input disabled="disabled" id="link-{field.description}" type="text" bind:value={field.value} />
      </li>
    {/each}
  </ul>
</Card>

<style>
  .spacer {
    height: 70px;
  }

  .avatar {
    width: 130px;
    height: 130px;
    overflow: hidden;
    margin: 0 auto;
    position: relative;
    bottom: -70px;
    border-radius: 1em;
  }

  .avatar > img {
    width: 120%;
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
    background-color: var(--color-input-readonly-background);
  }
</style>
