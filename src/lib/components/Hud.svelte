<script module>
  import { game_store, hud_store } from '../../shared/store.js';
  import { onDestroy } from 'svelte';
  import * as Player from './Player.svelte';

  let game_ctx;
  let sprite_ctx;
  let sprite_canvas;
  let game_bounds;
  let hud;
  let hiscore = 0;

  const game_store_bounds_unsubscribe = game_store.bounds.subscribe(value => {
    game_bounds = value;
  });

  const game_store_contexts_unsubscribe = game_store.contexts.subscribe(value => {
    game_ctx = value.game_ctx;
    sprite_ctx = value.sprite_ctx;
    sprite_canvas = value.sprite_canvas;
  });

  const hud_store_unsubscribe = hud_store.subscribe(value => {
    hud = value;
  });

  let banner_top_y = 40;
  let banner_bottom_y = game_store.CANVAS_HEIGHT - 10;

  //================================================================================
  // draw score
  //================================================================================

  export const draw = () => {
    if (hud.score > hiscore) {
      hiscore = hud.score;
    }
    let score_text = String(hud.score).padStart(5, '0');
    let hiscore_text = String(hiscore).padStart(5, '0');

    game_ctx.font = '30px "Sixtyfour"';

    game_ctx.fillStyle = '#ff6633';
    game_ctx.fillText(`SCORE`, 30, banner_top_y);

    game_ctx.fillStyle = 'white';
    game_ctx.fillText(score_text, 200, banner_top_y);

    game_ctx.fillStyle = '#11ccff';
    game_ctx.fillText(`HISCORE`, 400, banner_top_y);

    game_ctx.fillStyle = 'white';
    game_ctx.fillText(hiscore_text, 625, banner_top_y);

    game_ctx.fillStyle = '#ff6633';
    game_ctx.fillText(`SHIPS`, 30, banner_bottom_y);
    Player.draw_player(200, banner_bottom_y - 20);
    Player.draw_player(260, banner_bottom_y - 20);

    game_ctx.fillStyle = '#00ff00';
    game_ctx.fillText(`WINS`, 400, banner_bottom_y);
  }
</script>

<script>
  onDestroy(() => {
    game_store_bounds_unsubscribe();
    game_store_contexts_unsubscribe();
    hud_store_unsubscribe();
  });
</script>
