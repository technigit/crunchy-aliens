<script>
  import { player_store } from '../../shared/store.js';
  import { game_store } from '../../shared/game_store.js';
  import { onDestroy, onMount } from 'svelte';
  import * as Player from './Player.svelte';
  import Enemy from './Enemy.svelte';
  import Bullet from './Bullet.svelte';

  let canvas;
  let game_bounds;
  let player;

  const game_store_unsubscribe = game_store.bounds.subscribe(value => {
    game_bounds = value;
  });

  const player_store_unsubscribe = player_store.subscribe(value => {
    player = value;
  });

  // gameplay attributes
  let score = 0;
  let playing;
  let pausing;
  let game_interval; // for game loop timer

  // bullets
  let bullets = [];
  let bullet_delta = 10;
  let bullet_width = 5;
  let bullet_height = 20;

  // enemies
  let enemies = [];
  let enemy_moving = game_store.RIGHT;
  let num_enemies = 30;
  let enemy_column_width = 60;
  let enemy_row_height = 70;
  let max_enemy_columns = 5;
  let enemy_delta = 2;
  let enemy_width = 50;
  let enemy_height = 50;

  onDestroy(() => {
    game_store_unsubscribe();
    player_store_unsubscribe();
  });

  //================================================================================
  // initialize the enemy formation
  //================================================================================

  const createEnemies = () => {
    let c = 0;
    let r = 0;
    for (let i = 0; i < num_enemies; i++) {
      enemies.push({ x: game_bounds.left_bound + game_bounds.vmargin + c * enemy_column_width, y: r * enemy_row_height + game_bounds.top_bound + game_bounds.hmargin, alive: true });
      c++;
      if (c > max_enemy_columns) {
        c = 0;
        r++;
      }
    }
  };

  //================================================================================
  // update the game area for the next frame
  //================================================================================

  const update = () => {
    // move player
    Player.move();

    // move bullets
    bullets = bullets.filter(bullet => bullet.y > game_bounds.top_bound + game_bounds.vmargin && !bullet.cleared);
    bullets.forEach(bullet => bullet.y -= bullet_delta);

    // check for collisions
    bullets.forEach(bullet => {
      enemies.forEach(enemy => {
        if (bullet.x < enemy.x + enemy_width && bullet.x + bullet_width > enemy.x && bullet.y < enemy.y + enemy_width && bullet.y + bullet_height > enemy.y) {
          enemy.alive = false;
          score += 10;
          bullet.cleared = true;
        }
      });
    });

    // move enemies
    let leftmost = game_bounds.right_bound - game_bounds.vmargin;
    let rightmost = game_bounds.left_bound + game_bounds.vmargin;
    enemies.forEach(enemy => {
      if (enemy.x < leftmost) {
        leftmost = enemy.x;
      }
      if (enemy.x > rightmost) {
        rightmost = enemy.x;
      }
    });
    let offset = 0;
    let rightmost_edge = rightmost + enemy_width;
    let left_breach = leftmost - enemy_delta;
    let right_breach = rightmost_edge + enemy_delta;
    if (enemy_moving == game_store.LEFT) {
      if (left_breach < game_bounds.left_bound + game_bounds.vmargin) {
        let limit = leftmost - game_bounds.left_bound - game_bounds.vmargin;
        offset = limit - enemy_delta;
      }
    }
    if (enemy_moving == game_store.RIGHT) {
      if (right_breach > game_bounds.right_bound - game_bounds.vmargin) {
        let limit = game_bounds.right_bound - game_bounds.vmargin - rightmost_edge;
        offset = limit - enemy_delta;
      }
    }
    enemies.forEach(enemy => {
      if (enemy_moving == game_store.LEFT) {
        enemy.x -= enemy_delta + offset;
      }
      if (enemy_moving == game_store.RIGHT) {
        enemy.x += enemy_delta + offset;
      }
    })
    if (enemy_moving == game_store.LEFT && left_breach <= game_bounds.left_bound + game_bounds.vmargin) {
      enemy_moving = game_store.RIGHT;
    } else if (enemy_moving == game_store.RIGHT && right_breach >= game_bounds.right_bound - game_bounds.vmargin) {
      enemy_moving = game_store.LEFT;
    }

    // remove eliminated enemies
    enemies = enemies.filter(enemy => enemy.alive);
  };

  //================================================================================
  // start a bullet fired by the player
  //================================================================================

  const shoot = () => {
    bullets.push({ x: player.x + player.gunpoint, y: player.y, cleared: false });
  };

  //================================================================================
  // process keypresses
  //================================================================================

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      Player.go_left();
    } else if (event.key === 'ArrowRight') {
      Player.go_right();
    } else if (event.key === ' ') {
      shoot();
    } else if (event.key === 'k') {
      if (!playing && !pausing) {
        start();
      }
    } else if (event.key === 'Escape') {
      if (playing) {
        pause();
      } else {
        play();
      }
    } else if (event.key === 'q') {
      score = 0;
      playing = false;
      pausing = false;
      enemies = [];
      bullets = [];
      clearInterval(game_interval);
    }
  };

  //================================================================================
  // set up the game ui elements
  //================================================================================

  const draw = () => {
    if (canvas == null) {
      return;
    }
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // background
    ctx.fillStyle = 'gray';
    ctx.fillRect(0, game_bounds.top_bound, game_bounds.left_bound, canvas.height - game_bounds.top_bound - game_bounds.bottom_bound);
    ctx.fillRect(game_bounds.right_bound, game_bounds.top_bound, canvas.width - game_bounds.right_bound, canvas.height - game_bounds.top_bound - game_bounds.bottom_bound);

    // hmargin areas (temporary)
    ctx.fillStyle = 'purple';
    ctx.fillRect(game_bounds.left_bound, game_bounds.top_bound, game_bounds.right_bound - game_bounds.left_bound, game_bounds.hmargin);
    ctx.fillRect(game_bounds.left_bound, canvas.height - game_bounds.top_bound - game_bounds.hmargin, game_bounds.right_bound - game_bounds.left_bound, game_bounds.hmargin);

    // vmargin areas (temporary)
    ctx.fillStyle = 'purple';
    ctx.fillRect(game_bounds.left_bound, game_bounds.top_bound, game_bounds.vmargin, canvas.height - game_bounds.top_bound - game_bounds.bottom_bound);
    ctx.fillRect(game_bounds.right_bound - game_bounds.vmargin, game_bounds.top_bound, game_bounds.vmargin, canvas.height - game_bounds.top_bound - game_bounds.bottom_bound);

    // draw player
    Player.draw(ctx);

    // draw bullets
    bullets.forEach(bullet => {
      ctx.fillStyle = 'yellow';
      ctx.fillRect(bullet.x, bullet.y, bullet_width, bullet_height);
    });

    // draw enemies
    enemies.forEach(enemy => {
      if (enemy.alive) {
        ctx.fillStyle = 'red';
        ctx.fillRect(enemy.x, enemy.y, enemy_width, enemy_height);
      }
    });

    // draw score
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
  };

  //================================================================================
  // interactive gameplay routines
  //================================================================================
  // play()
  // start()
  // pause()
  //================================================================================

  const play = () => {
    playing = true;
    pausing = false;
    game_interval = setInterval(() => {
      if (!playing) {
        clearInterval(interval);
      }
      update();
      draw();
    }, game_store.TIME_INTERVAL);
  };

  function start() {
    Player.init();
    createEnemies();
    play();
  }

  function pause() {
    playing = false;
    pausing = true;
    clearInterval(game_interval)
  }

  // initialize game ui
  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
    draw();
    if (game_store.AUTOSTART) {
      start();
    }
  });
</script>

<style>
  canvas {
    background: black;
    margin-left: auto; margin-right: auto;
  }
</style>

<canvas bind:this={canvas} width="{game_store.CANVAS_WIDTH}" height="{game_store.CANVAS_HEIGHT}"></canvas>
