<script>
  export let url
</script>

<a href={url}>
  <slot></slot>
</a>

<style>
  /** TODO use css vars **/
  a {
    color: inherit;
    text-decoration: none;
  }

  a:hover {
    text-decoration: none;
  }
</style>
