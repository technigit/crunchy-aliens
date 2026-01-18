<script module>
  import { game_store, hud_store, enemy_store } from '../../shared/store.js';
  import { onMount, onDestroy } from 'svelte';

  let game_ctx;
  let sprite_ctx;
  let sprite_canvas;
  let game_bounds;
  let hud;
  let bullet_;
  let enemy_;
  let enemy_moving = game_store.RIGHT;
  let tau_step = 0;
  let sprite_frames_x = [50, 100, 150];
  let sprite_frames_y = 0;
  let sprite_tau = 5;
  let sprite_step = 0;
  let sprite_rotation = 0;
  let sprite_rotation_max = 3;

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

  const enemy_store_unsubscribe = enemy_store.subscribe(value => {
    enemy_ = value;
  });

  //================================================================================
  // update the enemy store
  //================================================================================

  function updateEnemies(value) {
    enemy_store.update(current => ({
      ...current,
      enemies: value
    }));
  }

  //================================================================================
  // initialize the enemy formation
  //================================================================================

  export const create = (game_ctx) => {
    let c = 0;
    let r = 0;
    for (let i = 0; i < enemy_.num_enemies; i++) {
      enemy_.enemies.push({
        x: game_bounds.left_bound + game_bounds.vmargin + c * enemy_.column_width,
        y: r * enemy_.row_height + game_bounds.top_bound + game_bounds.hmargin,
        alive: true,
        value: 10,
      });
      c++;
      if (c > enemy_.max_columns) {
        c = 0;
        r++;
      }
    }
    draw_sprites();
  };

  //================================================================================
  // draw enemies
  //================================================================================

  export const draw = () => {
    enemy_.enemies.forEach(enemy => {
      if (enemy.alive) {
        game_ctx.drawImage(sprite_canvas, sprite_frames_x[sprite_rotation], sprite_frames_y, enemy_.width, enemy_.height, enemy.x, enemy.y, enemy_.width, enemy_.height);
      }
    });
  };

  const draw_sprites = () => {
    let x = sprite_frames_x[0];
    let y = sprite_frames_y;
    sprite_ctx.fillStyle = 'orange';
    sprite_ctx.fillRect(x + 20, y, 10, 5);
    sprite_ctx.fillStyle = 'purple';
    sprite_ctx.fillRect(x, y + 5, 50, 10);
    sprite_ctx.fillStyle = 'gray';
    sprite_ctx.fillRect(x + 10, y + 15, 10, 5);
    sprite_ctx.fillRect(x + 30, y + 15, 10, 5);

    x = sprite_frames_x[1];
    sprite_ctx.fillStyle = 'purple';
    sprite_ctx.fillRect(x, y + 5, 50, 10);
    sprite_ctx.fillStyle = 'gray';
    sprite_ctx.fillRect(x + 0, y + 15, 10, 5);
    sprite_ctx.fillRect(x + 40, y + 15, 10, 5);

    x = sprite_frames_x[2];
    sprite_ctx.fillStyle = 'orange';
    sprite_ctx.fillRect(x + 10, y, 30, 5);
    sprite_ctx.fillStyle = 'purple';
    sprite_ctx.fillRect(x, y + 5, 50, 10);
    sprite_ctx.fillStyle = 'gray';
    sprite_ctx.fillRect(x + 20, y + 15, 10, 5);
  }

  //================================================================================
  // move enemies
  //================================================================================

  export const move = () => {
    tau_step = (tau_step + 1) % (enemy_.tau + 1);
    if (tau_step) {
      return;
    }
    sprite_step = (sprite_step + 1) % (sprite_tau + 1);
    if (!sprite_step) {
      sprite_rotation = (sprite_rotation + 1) % sprite_rotation_max;
    }
    let leftmost = game_bounds.right_bound - game_bounds.vmargin;
    let rightmost = game_bounds.left_bound + game_bounds.vmargin;
    enemy_.enemies.forEach(enemy => {
      if (enemy.x < leftmost) {
        leftmost = enemy.x;
      }
      if (enemy.x > rightmost) {
        rightmost = enemy.x;
      }
    });
    let offset = 0;
    let rightmost_edge = rightmost + enemy_.width;
    let left_breach = leftmost - enemy_.delta;
    let right_breach = rightmost_edge + enemy_.delta;
    if (enemy_moving == game_store.LEFT) {
      if (left_breach < game_bounds.left_bound + game_bounds.vmargin) {
        let limit = leftmost - game_bounds.left_bound - game_bounds.vmargin;
        offset = limit - enemy_.delta;
      }
    }
    if (enemy_moving == game_store.RIGHT) {
      if (right_breach > game_bounds.right_bound - game_bounds.vmargin) {
        let limit = game_bounds.right_bound - game_bounds.vmargin - rightmost_edge;
        offset = limit - enemy_.delta;
      }
    }
    enemy_.enemies.forEach(enemy => {
      if (enemy_moving == game_store.LEFT) {
        enemy.x -= enemy_.delta + offset;
      }
      if (enemy_moving == game_store.RIGHT) {
        enemy.x += enemy_.delta + offset;
      }
    })
    if (enemy_moving == game_store.LEFT && left_breach <= game_bounds.left_bound + game_bounds.vmargin) {
      enemy_moving = game_store.RIGHT;
    } else if (enemy_moving == game_store.RIGHT && right_breach >= game_bounds.right_bound - game_bounds.vmargin) {
      enemy_moving = game_store.LEFT;
    }

    // remove eliminated enemies
    enemy_.enemies = enemy_.enemies.filter(enemy => enemy.alive);
  }

  //================================================================================
  // eliminate an enemy
  //================================================================================

  export const eliminate = (enemy) => {
    enemy.alive = false;
    hud.score += enemy.value;
  }

  //================================================================================
  // clear enemies
  //================================================================================

  export const clear = () => {
    updateEnemies([]);
  }
</script>

<script>
  onMount(() => {
  });

  onDestroy(() => {
    game_store_bounds_unsubscribe();
    game_store_contexts_unsubscribe();
    hud_store_unsubscribe();
    enemy_store_unsubscribe();
  });
</script>
