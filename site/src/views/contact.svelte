<script>
  import Card from '../components/Card.svelte'
  import FormTitle from '../components/FormTitle.svelte'
</script>

<main>
  <section id="contact">
    <FormTitle title="Contact" />

    <Card>
      <p>
      Keep up with our progress at <a href="https://twitter.com/linkensxyz">@linkensxyz</a>.
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
