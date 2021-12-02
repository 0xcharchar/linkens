<script>
  import Card from '../components/Card.svelte'
  import FormTitle from '../components/FormTitle.svelte'
</script>

<main>
  <section id="about">
    <FormTitle title="About" />

    <Card>
      <p>
    LinkENS is a social network aggregator that you own. We help you generate an
    ENS subdomain, fill in ENS records, and deploy a website with links to your
    other social media profiles. Use LinkENS as your one link to point everyone
    to.
      </p>
    </Card>
  </section>
</main>

<style>
  main {
    padding: 0;
  }

  @media (min-width:801px) { /* tablet, landscape iPad, lo-res laptops ands desktops */
    main {
      margin: 0 auto;
      width: 60ch;
    }
  }
</style>
