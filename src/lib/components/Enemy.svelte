<script module>
  import { game_store } from '../../shared/game_store.js';
  import { hud_store, enemy_store } from '../../shared/store.js';
  import { onDestroy } from 'svelte';

  let game_bounds;
  let hud;
  let bullet_;
  let enemy_;
  let enemy_moving = game_store.RIGHT;

  const game_store_unsubscribe = game_store.bounds.subscribe(value => {
    game_bounds = value;
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

  export const create = (ctx) => {
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
  };

  //================================================================================
  // draw enemies
  //================================================================================

  export const draw = (ctx) => {
    enemy_.enemies.forEach(enemy => {
      if (enemy.alive) {
        ctx.fillStyle = 'red';
        ctx.fillRect(enemy.x, enemy.y, enemy_.width, enemy_.height);
      }
    });
  };

  //================================================================================
  // move enemies
  //================================================================================

  export const move = () => {
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
  onDestroy(() => {
    game_store_unsubscribe();
    hud_store_unsubscribe();
    enemy_store_unsubscribe();
  });
</script>
