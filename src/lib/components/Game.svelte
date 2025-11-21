<script>
  import { onMount } from 'svelte';
  import Player from './Player.svelte';
  import Enemy from './Enemy.svelte';
  import Bullet from './Bullet.svelte';

  const AUTOSTART = true;
  const FPS = 60;
  const TIME_INTERVAL = 1000/FPS;
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const LEFT = 0;
  const RIGHT = 1;
  const STOP = -1;

  let canvas;

  // gameplay attributes
  let score = 0;
  let playing;
  let pausing;
  let game_interval; // for game loop timer

  // left_bound: distance from canvas left
  // right_bound: distance from canvas left
  // top_bound: distance from canvas top
  // bottom_bound: distance from canvas bottom
  let left_bound = 50;
  let right_bound = CANVAS_WIDTH - left_bound;
  let top_bound = 50;
  let bottom_bound = 50;

  // horizontal/vertical margins around the playing space, within the bounds
  let hmargin = 10;
  let vmargin = 10;

  // bullets
  let bullets = [];
  let bullet_delta = 10;
  let bullet_width = 5;
  let bullet_height = 20;

  // player
  let player_moving = STOP;
  let player_delta = 5;
  let player_width = 50;
  let player_height = 20;
  let player_gunpoint = player_width / 2 - bullet_width / 2;
  let player_y = player_height + hmargin + bottom_bound; // relative to canvas bottom
  let player = { x: (left_bound + right_bound) / 2 - player_width / 2, y: CANVAS_HEIGHT - player_y };

  // enemies
  let enemies = [];
  let enemy_moving = RIGHT;
  let num_enemies = 30;
  let enemy_column_width = 60;
  let enemy_row_height = 70;
  let max_enemy_columns = 5;
  let enemy_delta = 2;
  let enemy_width = 50;
  let enemy_height = 50;

  //================================================================================
  // initialize the enemy formation
  //================================================================================

  const createEnemies = () => {
    let c = 0;
    let r = 0;
    for (let i = 0; i < num_enemies; i++) {
      enemies.push({ x: left_bound + vmargin + c * enemy_column_width, y: r * enemy_row_height + top_bound + hmargin, alive: true });
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
    if (player_moving == LEFT && player.x - player_delta >= left_bound + vmargin) {
      player.x -= player_delta;
    } else if (player_moving == LEFT) {
      player.x = left_bound + vmargin;
    } else if (player_moving == RIGHT && player.x + player_delta <= right_bound - player_width - vmargin) {
      player.x += player_delta;
    } else if (player_moving == RIGHT) {
      player.x = right_bound - player_width - vmargin;
    } else {
      player_moving = STOP;
    }

    // move bullets
    bullets = bullets.filter(bullet => bullet.y > top_bound + vmargin && !bullet.cleared);
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
    let leftmost = right_bound - vmargin;
    let rightmost = left_bound + vmargin;
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
    if (enemy_moving == LEFT) {
      if (left_breach < left_bound + vmargin) {
        let limit = leftmost - left_bound - vmargin;
        offset = limit - enemy_delta;
      }
    }
    if (enemy_moving == RIGHT) {
      if (right_breach > right_bound - vmargin) {
        let limit = right_bound - vmargin - rightmost_edge;
        offset = limit - enemy_delta;
      }
    }
    enemies.forEach(enemy => {
      if (enemy_moving == LEFT) {
        enemy.x -= enemy_delta + offset;
      }
      if (enemy_moving == RIGHT) {
        enemy.x += enemy_delta + offset;
      }
    })
    if (enemy_moving == LEFT && left_breach <= left_bound + vmargin) {
      enemy_moving = RIGHT;
    } else if (enemy_moving == RIGHT && right_breach >= right_bound - vmargin) {
      enemy_moving = LEFT;
    }

    // remove eliminated enemies
    enemies = enemies.filter(enemy => enemy.alive);
  };

  //================================================================================
  // start a bullet fired by the player
  //================================================================================

  const shoot = () => {
    bullets.push({ x: player.x + player_gunpoint, y: player.y, cleared: false });
  };

  //================================================================================
  // process keypresses
  //================================================================================

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      player_moving = LEFT;
    } else if (event.key === 'ArrowRight') {
      player_moving = RIGHT;
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
    ctx.fillRect(0, top_bound, left_bound, canvas.height - top_bound - bottom_bound);
    ctx.fillRect(right_bound, top_bound, canvas.width - right_bound, canvas.height - top_bound - bottom_bound);

    // hmargin areas (temporary)
    ctx.fillStyle = 'purple';
    ctx.fillRect(left_bound, top_bound, right_bound - left_bound, hmargin);
    ctx.fillRect(left_bound, canvas.height - top_bound - hmargin, right_bound - left_bound, hmargin);

    // vmargin areas (temporary)
    ctx.fillStyle = 'purple';
    ctx.fillRect(left_bound, top_bound, vmargin, canvas.height - top_bound - bottom_bound);
    ctx.fillRect(right_bound - vmargin, top_bound, vmargin, canvas.height - top_bound - bottom_bound);

    // draw player
    ctx.fillStyle = 'white';
    ctx.fillRect(player.x, player.y, player_width, player_height);

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
    }, TIME_INTERVAL);
  };

  function start() {
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
    if (AUTOSTART) {
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

<canvas bind:this={canvas} width="{CANVAS_WIDTH}" height="{CANVAS_HEIGHT}"></canvas>
