<script module>
  import { game_store, player_store } from '../../shared/store.js';
  import { onMount, onDestroy } from 'svelte';
  import * as Bullet from './Bullet.svelte';

  let game_ctx;
  let sprite_ctx;
  let sprite_canvas;
  let sprite_frame_x = 0;
  let sprite_frame_y = 0;
  let game_bounds;
  let player;

  let move_cooldown = 0;
  let tau_step = 0;

  const game_store_bounds_unsubscribe = game_store.bounds.subscribe(value => {
    game_bounds = value;
  });

  const game_store_contexts_unsubscribe = game_store.contexts.subscribe(value => {
    game_ctx = value.game_ctx;
    sprite_ctx = value.sprite_ctx;
    sprite_canvas = value.sprite_canvas;
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
    draw_sprites();
  };

  //================================================================================
  // draw player
  //================================================================================

  export const draw = () => {
    if (player) {
      draw_player();
    }
  }

  export const draw_player = (x = player.x, y = player.y, width = player.width, height = player.height) => {
    game_ctx.drawImage(sprite_canvas, sprite_frame_x, sprite_frame_y, player.width, player.height, x, y, player.width, player.height);
  }

  const draw_sprites = () => {
    let x = sprite_frame_x;
    let y = sprite_frame_y;
    sprite_ctx.fillStyle = 'orange';
    sprite_ctx.fillRect(x + 20, y, 10, 5); // Cockpit
    sprite_ctx.fillStyle = 'white';
    sprite_ctx.fillRect(x, y + 5, 50, 10); // Ship body
    sprite_ctx.fillStyle = 'gray';
    sprite_ctx.fillRect(x + 10, y + 15, 10, 5); // Engine 1
    sprite_ctx.fillRect(x + 30, y + 15, 10, 5); // Engine 2
  }

  //================================================================================
  // player movement
  //================================================================================

  export const move = () => {
    tau_step = (tau_step + 1) % (player.tau + 1);
    if (tau_step) {
      return;
    }
    if (move_cooldown > 0) {
      move_cooldown--;
    } else {
      return
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
    game_store_bounds_unsubscribe();
    game_store_contexts_unsubscribe();
    player_store_unsubscribe();
  });
</script>
