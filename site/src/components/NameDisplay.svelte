<h3>
  <slot></slot><span class="fancy">.{process.env.ENS_NODE}</span>
</h3>

<style>
  h3 {
    text-align: center;
    margin: 0 0 1em 0;
    padding: 0;
  }

  .fancy {
    color: #637fff;
  }

  @supports (-webkit-background-clip: text) {
    .fancy {
      color: transparent;
      background: linear-gradient(60deg, #637fff 0%, #918eff 30%, #79aeff 86%, #669bff 100%);
      -webkit-background-clip: text;
    }
  }
</style>
