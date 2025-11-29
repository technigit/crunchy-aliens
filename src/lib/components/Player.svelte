<script module>
  import { game_store } from '../../shared/game_store.js';
  import { player_store } from '../../shared/store.js';
  import { onDestroy } from 'svelte';
  import * as Bullet from './Bullet.svelte';

  let game_bounds;
  let player;

  const game_store_unsubscribe = game_store.bounds.subscribe(value => {
    game_bounds = value;
  });

  const player_store_unsubscribe = player_store.subscribe(value => {
    player = value;
  });

  let player_moving = game_store.STOP;

  export const init = () => {
    if (game_bounds) {
      let player_y = player.height + game_bounds.hmargin + game_bounds.bottom_bound; // relative to canvas bottom
      player_store.update(current => ({
        ...current,
        x: (game_bounds.left_bound + game_bounds.right_bound) / 2 - player.width / 2,
        y: game_store.CANVAS_HEIGHT - player_y }
      ));
    }
  };

  export const draw = (ctx) => {
    if (player) {
      ctx.fillStyle = 'white';
      ctx.fillRect(player.x, player.y, player.width, player.height);
    }
  }

  export const move = (cts) => {
    if (player) {
      if (player_moving == game_store.LEFT && player.x - player.delta >= game_bounds.left_bound + game_bounds.vmargin) {
        player.x -= player.delta;
      } else if (player_moving == game_store.LEFT) {
        player.x = game_bounds.left_bound + game_bounds.vmargin;
      } else if (player_moving == game_store.RIGHT && player.x + player.delta <= game_bounds.right_bound - player.width - game_bounds.vmargin) {
        player.x += player.delta;
      } else if (player_moving == game_store.RIGHT) {
        player.x = game_bounds.right_bound - player.width - game_bounds.vmargin;
      } else {
        player_moving = game_store.STOP;
      }
      player_store.set(player);
    }
  }

  export const go_left = () => {
    player_moving = game_store.LEFT;
  }

  export const go_right = () => {
    player_moving = game_store.RIGHT;
  }

  //================================================================================
  // start a bullet fired by the player
  //================================================================================

  export const shoot = () => {
    Bullet.fire();
  }
</script>

<script>
  onDestroy(() => {
    game_store_unsubscribe();
    player_store_unsubscribe();
  });
</script>
