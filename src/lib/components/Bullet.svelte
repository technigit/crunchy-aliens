<script module>
  import { game_store } from '../../shared/game_store.js';
  import { player_store, bullet_store, enemy_store } from '../../shared/store.js';
  import * as Enemy from './Enemy.svelte';
  import { onDestroy } from 'svelte';

  let game_bounds;
  let player;
  let bullet_;
  let bullets = [];
  let enemy_;

  const game_store_unsubscribe = game_store.bounds.subscribe(value => {
    game_bounds = value;
  });

  const player_store_unsubscribe = player_store.subscribe(value => {
    player = value;
  });

  const bullet_store_unsubscribe = bullet_store.subscribe(value => {
    bullet_ = value;
  });

  const enemy_store_unsubscribe = enemy_store.subscribe(value => {
    enemy_ = value;
  });

  //================================================================================
  // start a bullet fired by the player
  //================================================================================

  export const fire = () => {
    bullets.push({ x: player.x + player.gunpoint, y: player.y, cleared: false });
  }

  //================================================================================
  // draw bullets
  //================================================================================

  export const draw = (ctx) => {
    bullets.forEach(bullet => {
      ctx.fillStyle = 'yellow';
      ctx.fillRect(bullet.x, bullet.y, bullet_.width, bullet_.height);
    });
  };

  //================================================================================
  // bullet movement
  //================================================================================

  export const move = () => {
    // move bullets
    bullets = bullets.filter(bullet => bullet.y > game_bounds.top_bound + game_bounds.vmargin && !bullet.cleared);
    bullets.forEach(bullet => bullet.y -= bullet_.delta);

    // check for collisions
    let enemies_ = enemy_.enemies;
    bullets.forEach(bullet => {
      enemies_.forEach(enemy => {
        if (bullet.x < enemy.x + enemy_.width && bullet.x + bullet_.width > enemy.x && bullet.y < enemy.y + enemy_.width && bullet.y + bullet_.height > enemy.y) {
          Enemy.eliminate(enemy);
          bullet.cleared = true;
        }
      });
    });
  }

  //================================================================================
  // reset bullets to none
  //================================================================================

  export const clear = () => {
    bullets = [];
  }
</script>

<script>
  onDestroy(() => {
    game_store_unsubscribe();
    player_store_unsubscribe();
    bullet_store_unsubscribe();
  });
</script>
