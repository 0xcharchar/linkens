<script>
  import { link } from 'svelte-spa-router'
</script>

<main>
  <section id="hero">
    <div>
      <h1>Site name</h1>
      <p>This is not linktr.ee</p>
      <a class="fake-button" href="#for-creators">For Creators</a>
      <a class="fake-button" href="#for-supporters">For Supporters</a>
    </div>

    <div>
      <img src="https://picsum.photos/600/300?grayscale">
    </div>
  </section>

  <section id="for-creators">
    <div>
      <img src="https://picsum.photos/400/200?grayscale">
    </div>

    <div class="description">
      <h3>For creators</h3>
      <p>It's not hard guys corporate synergy. Moving the goalposts value-added touch base killing it, for going forward. This is not the hill i want to die on 4-blocker what the zeitgeist but high performance keywords or product launch. Get buy-in. Level the playing field fire up your browser, drop-dead date.</p>
      <a class="fake-button" href="/wizard" use:link>Let's build!</a>
    </div>
  </section>

  <section id="for-supporters">
    <div class="description">
      <h3>For supporters</h3>
      <p>I need to pee and then go to another meeting sorry i didn't get your email. Window-licker closer to the metal and going forward. We need to get all stakeholders up to speed and in the right place race without a finish line sorry i was triple muted and form without content style without meaning yet obviously but we're ahead of the curve on that one but digital literacy.</p>
      <a class="fake-button" href="#">Find your favourite creator</a>
    </div>

    <div>
      <img src="https://picsum.photos/400/200?grayscale">
    </div>
  </section>

  <section id="footer">
    <div>
      <img src="/dummy-logo.png" width="100" height="100">
    </div>

    <div>
      <p>My grasp on reality right now is tenuous. We've got kpis for that we need to crystallize a plan. Shotgun approach value prop. First-order optimal strategies I have zero cycles for this, so are there any leftovers in the kitchen?</p>
    </div>

    <div>
      <p>Links</p>
      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Creators</a></li>
        <li><a href="#">Supporters</a></li>
      </ul>
    </div>
  </section>
</main>

<style>
  main {
    padding: 0;
    margin: 0;
  }

  section {
    width: 100%;
    padding: 0 1rem;
    margin: 0 0 1rem 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }

  .description {
    max-width: 60ch;
  }

  #hero {
    background: #dedede;
    flex-direction: column-reverse;
    text-align: center;
  }

  #hero p {
    font-size: 1.2rem;
  }

  #footer {
    background: #3a3a3a;
    padding: 1rem;
    color: #efefef;
  }

  #footer div {
    margin: 1rem;
  }

  #for-supporters {
    flex-direction: column-reverse;
  }

  .fake-button {
    display: block;
    padding: 0.5rem;
    background: #464646;
    margin: 0.5rem;
    color: #f5f5f5;
    text-align: center;
  }
</style>
