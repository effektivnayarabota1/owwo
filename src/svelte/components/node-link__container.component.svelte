<div class="node-info__container">
  <slot />
</div>

<style>
  .node-info__container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: calc(var(--GRID-GAP) / 4);
  }
  @media screen and (max-width: 360px) {
    .node-info__container {
      max-width: 100%;
      gap: calc(var(--GRID-GAP));
    }
  }
</style>
