<header>
  <h1>LinkENS</h1>

  <section>
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>

    <button>Connect Wallet</button>

    <div class="theme-swithcer">
    </div>
  </section>
</header>

<style>
  h1 {
    margin: 0;
  }

  header {
    padding: 1.5em;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  header > section {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  ul {
    list-style-type: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    margin: 0;
  }

  li {
    display: inline-block;
  }

  li > a {
    display: block;
    padding: 1em 1.5em;
    color: #717379;
    text-decoration: none;
  }

  li > a:hover {
    text-decoration: underline;
  }
</style>
