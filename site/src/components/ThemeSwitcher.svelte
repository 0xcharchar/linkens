<script>
  import { onMount } from 'svelte'
  import SunnyIcon from '@svicons/ionicons-solid/sunny.svelte'
  import MoonIcon from '@svicons/ionicons-solid/moon.svelte'
  import LoadingIcon from '@svicons/ionicons-solid/refresh.svelte'

  import { theme } from '../stores/theme'

  function toggleTheme () {
    $theme = $theme === 'dark' ? 'light' : 'dark'
  }

  const iconSize = {
    width: '1.5em',
    height: '1.5em'
  }

  onMount(() => {
    const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches
    $theme = prefersDark ? 'dark' : 'light'
  })
</script>

{#if $theme === 'dark'}
  <div on:click={toggleTheme}><SunnyIcon {...iconSize} color="#FFAB75" /></div>
{:else if $theme === 'light'}
  <div on:click={toggleTheme}><MoonIcon {...iconSize} color="#FFD82B" /></div>
{:else}
  <div class="rotate" on:click={toggleTheme}><LoadingIcon {...iconSize} /></div>
{/if}

<style>
  .rotate {
    animation: rotation 1s infinite linear;
  }

  @keyframes rotation {
    from { transform: rotate(0deg); }
    to { transform: rotate(359deg); }
  }
</style>
