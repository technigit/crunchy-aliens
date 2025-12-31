<script module>
  import { game_store, player_store } from '../../shared/store.js';
  import { onDestroy } from 'svelte';
  import * as Bullet from './Bullet.svelte';

  let game_bounds;
  let player;

  let move_cooldown = 0;
  let tau_step = 0;

  const game_store_unsubscribe = game_store.bounds.subscribe(value => {
    game_bounds = value;
  });

  const player_store_unsubscribe = player_store.subscribe(value => {
    player = value;
  });

  let player_moving = game_store.STOP;

  //================================================================================
  // initialize player
  //================================================================================

  export const init = () => {
    if (game_bounds) {
      let player_y = player.height + game_bounds.hmargin + game_bounds.bottom_bound; // relative to canvas bottom
      player_moving = game_store.STOP;
      player_store.update(current => ({
        ...current,
        x: (game_bounds.left_bound + game_bounds.right_bound) / 2 - player.width / 2,
        y: game_store.CANVAS_HEIGHT - player_y }
      ));
    }
  };

  //================================================================================
  // draw player
  //================================================================================

  export const draw = (ctx) => {
    if (player) {
      draw_player(ctx);
    }
  }

  export const draw_player = (ctx, x = player.x, y = player.y, width = player.width, height = player.height) => {
    ctx.fillStyle = 'white';
    ctx.fillRect(x, y, width, height);
  }

  //================================================================================
  // player movement
  //================================================================================

  export const move = () => {
    tau_step++;
    if (tau_step > player.tau) {
      tau_step = 0;
    } else {
      return;
    }
    if (move_cooldown) {
      move_cooldown > 0 ? move_cooldown-- : move_cooldown;
    } else {
      return;
    }
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

  //================================================================================
  // player control movement
  //================================================================================

  export const go_left = () => {
    if (move_cooldown == 0 || player_moving == game_store.RIGHT) {
      player_moving = game_store.LEFT;
      move_cooldown = player.move_cooldown;
    }
  }

  export const go_right = () => {
    if (move_cooldown == 0 || player_moving == game_store.LEFT) {
      player_moving = game_store.RIGHT;
      move_cooldown = player.move_cooldown;
    }
  }

  export const go_left_right = () => {
    player_moving = game_store.STOP;
    move_cooldown = 0;
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
