<script>
  export let title
  export let subtitle = ''
</script>

<div>
  <h2>{title}</h2>
  {#if subtitle}
    <p>{subtitle}</p>
  {/if}
</div>

<style>
  div {
    margin: 16px 0;
  }

  h2 {
    margin: 0;
    text-align: center;
  }

  p {
    text-align: center;
    margin: 0;
    margin-top: 16px;
  }
</style>
