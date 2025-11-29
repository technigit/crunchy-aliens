<script module>
  import { game_store } from '../../shared/game_store.js';
  import { player_store, bullet_store } from '../../shared/store.js';
  import { onDestroy } from 'svelte';

  let game_bounds;
  let player;
  let bullet_;
  let bullets = [];
  let enemies = [];

  const game_store_unsubscribe = game_store.bounds.subscribe(value => {
    game_bounds = value;
  });

  const player_store_unsubscribe = player_store.subscribe(value => {
    player = value;
  });

  const bullet_store_unsubscribe = bullet_store.subscribe(value => {
    bullet_ = value;
  });

  export const fire = () => {
    bullets.push({ x: player.x + player.gunpoint, y: player.y, cleared: false });
  }

  export const draw = (ctx) => {
    // move bullets
    bullets.forEach(bullet => {
      ctx.fillStyle = 'yellow';
      ctx.fillRect(bullet.x, bullet.y, bullet_.width, bullet_.height);
    });
  };

  export const move = () => {
    // move bullets
    bullets = bullets.filter(bullet => bullet.y > game_bounds.top_bound + game_bounds.vmargin && !bullet.cleared);
    bullets.forEach(bullet => bullet.y -= bullet_.delta);

    // check for collisions
    bullets.forEach(bullet => {
      enemies.forEach(enemy => {
        if (bullet.x < enemy.x + enemy_width && bullet.x + bullet_.width > enemy.x && bullet.y < enemy.y + enemy_width && bullet.y + bullet_.height > enemy.y) {
          enemy.alive = false;
          score += 10;
          bullet.cleared = true;
        }
      });
    });
  }

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
