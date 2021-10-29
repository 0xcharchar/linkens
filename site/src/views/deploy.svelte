<script>
  import Record from '../components/Record.svelte'

  const addresses = [
    { coinType: 'ETH', address: 'abc' },
    { coinType: 'DOGE', address: 'easyas' },
    { coinType: 'LTC', address: '123' },
    { coinType: 'BTC', address: 'doremi' },
  ]

  const socials = [
    { text: 'Website', url: 'http', handle: '0xcharchar.github.com/wiki' },
    { text: 'Email', url: 'http', handle: '0xcharchar@protonmail.com' },
    { text: 'Twitter', url: 'http', handle: '0xcharchar' },
    { text: 'Github', url: 'http', handle: '0xcharchar' },
  ]
</script>

<section id="header">
  <div class="avatar"></div>
  <h1>User's name</h1>
  <p>Description</p>
</section>

<section>
  <h2>Crypto</h2>
  <ul>
    {#each addresses as { coinType, address }}
    <li>
      <Record msgText={coinType} iconName={coinType} content={address} />
    </li>
    {/each}
  </ul>
</section>

<section>
  <h2>Social</h2>
  <ul>
    {#each socials as { text, url, handle }}
    <li>
      <Record msgText={text} iconName={url} content={handle} />
    </li>
    {/each}
  </ul>
</section>

<section>
  <h2>Gallery</h2>

  <ul>
    {#each nft as { token, url, series }}
    <li>
      <Record msgText={text} iconName={url} content={handle} />
    </li>
    {/each}
  </ul>
</section>
