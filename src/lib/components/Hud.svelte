<script module>
  import { game_store, hud_store } from '../../shared/store.js';
  import { onDestroy } from 'svelte';
  import * as Player from './Player.svelte';

  let game_bounds;
  let hud;
  let hiscore = 0;

  const game_store_unsubscribe = game_store.bounds.subscribe(value => {
    game_bounds = value;
  });

  const hud_store_unsubscribe = hud_store.subscribe(value => {
    hud = value;
  });

  let banner_top_y = 40;
  let banner_bottom_y = game_store.CANVAS_HEIGHT - 10;

  //================================================================================
  // draw score
  //================================================================================

  export const draw = (ctx) => {
    if (hud.score > hiscore) {
      hiscore = hud.score;
    }
    let score_text = String(hud.score).padStart(5, '0');
    let hiscore_text = String(hiscore).padStart(5, '0');

    ctx.font = '30px "Sixtyfour"';

    ctx.fillStyle = '#ff6633';
    ctx.fillText(`SCORE`, 30, banner_top_y);

    ctx.fillStyle = 'white';
    ctx.fillText(score_text, 200, banner_top_y);

    ctx.fillStyle = '#11ccff';
    ctx.fillText(`HISCORE`, 400, banner_top_y);

    ctx.fillStyle = 'white';
    ctx.fillText(hiscore_text, 625, banner_top_y);

    ctx.fillStyle = '#ff6633';
    ctx.fillText(`SHIPS`, 30, banner_bottom_y);
    Player.draw_player(ctx, 200, banner_bottom_y - 20);
    Player.draw_player(ctx, 260, banner_bottom_y - 20);

    ctx.fillStyle = '#00ff00';
    ctx.fillText(`WINS`, 400, banner_bottom_y);
  }
</script>

<script>
  onDestroy(() => {
    game_store_unsubscribe();
    hud_store_unsubscribe();
  });
</script>
