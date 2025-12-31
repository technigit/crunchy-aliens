<script module>
  import { game_store, player_store, bullet_store, enemy_store } from '../../shared/store.js';
  import * as Enemy from './Enemy.svelte';
  import { onDestroy } from 'svelte';

  let game_bounds;
  let player;
  let bullet_;
  let bullets = [];
  let enemy_;

  let fire_cooldown = 0;
  let tau_step = 0;

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
    if (!fire_cooldown && bullets.length < bullet_.fire_max) {
      bullets.push({ x: player.x + player.gunpoint_x, y: player.y - player.gunpoint_y + player.gunheight, cleared: false });
      fire_cooldown = bullet_.fire_cooldown;
    }
  }

  //================================================================================
  // draw bullets
  //================================================================================

  export const draw = (ctx) => {
    let by, bh;
    let gp = player.y - player.gunpoint_y;
    bullets.forEach(bullet => {
      by = bullet.y - bullet_.height;
      bh = bullet_.height;
      if (by < game_bounds.top_bound + game_bounds.vmargin) {
        by = game_bounds.top_bound + game_bounds.vmargin;
        bh = bullet.y - by;
      } else if (bullet.y > gp) {
        bh = gp - by;
      }
      if (by < gp) {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(bullet.x, by, bullet_.width, bh);
      }
    });
  };

  //================================================================================
  // bullet movement
  //================================================================================

  export const move = () => {
    tau_step++;
    if (tau_step > bullet_.tau) {
      tau_step = 0;
    } else {
      return;
    }
    if (fire_cooldown) {
      fire_cooldown--;
    }
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
