<script module>
  import { game_store } from '../../shared/game_store.js';
  import { hud_store } from '../../shared/store.js';
  import { onDestroy } from 'svelte';

  let game_bounds;
  let hud;

  const game_store_unsubscribe = game_store.bounds.subscribe(value => {
    game_bounds = value;
  });

  const hud_store_unsubscribe = hud_store.subscribe(value => {
    hud = value;
  });

  //================================================================================
  // draw score
  //================================================================================

  export const draw = (ctx) => {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${hud.score}`, 10, 20);
  }
</script>

<script>
  onDestroy(() => {
    game_store_unsubscribe();
    hud_store_unsubscribe();
  });
</script>
