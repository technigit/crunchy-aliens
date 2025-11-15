<script>
  import { onMount } from 'svelte';
  import Player from './Player.svelte';
  import Enemy from './Enemy.svelte';
  import Bullet from './Bullet.svelte';

  const TIME_INTERVAL = 100;
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  let left_bound = 100;
  let right_bound = 750;
  let margin = 50;
  let ticks = 0;
  let playing = true;
  let canvas;
  let player = { x: 175, y: 550 };
  let bullets = [];
  let enemies = [];
  let score = 0;
  const LEFT = 0;
  const RIGHT = 1;
  const STOP = -1;
  let player_moving = STOP;
  let enemy_moving = RIGHT;
  let player_delta = 20;
  let enemy_delta = 15;
  let player_width = 50;
  let enemy_width = 50;

  const createEnemies = () => {
    let num_enemies = 30;
    let column_width = 60;
    let row_height = 70;
    let max_columns = 5;
    let c = 0;
    let r = 0;
    for (let i = 0; i < num_enemies; i++) {
      enemies.push({ x: left_bound + margin + c * column_width, y: r * row_height, alive: true });
      c++;
      if (c > max_columns) {
        c = 0;
        r++;
      }
    }
  };

  const reverse = () => {
    if (enemy_moving == LEFT) {
      enemy_moving = RIGHT;
    } else if (enemy_moving == RIGHT) {
      enemy_moving = LEFT;
    }
  }

  const update = () => {
    // move player
    if (player_moving == LEFT && player.x - player_delta >= left_bound + margin) {
      player.x -= player_delta;
    } else if (player_moving == LEFT) {
      player.x = left_bound + margin;
    } else if (player_moving == RIGHT && player.x + player_delta <= right_bound - player_width - margin) {
      player.x += player_delta;
    } else if (player_moving == RIGHT) {
      player.x = right_bound - player_width - margin;
    } else {
      player_moving = STOP;
    }

    // move bullets
    bullets = bullets.filter(bullet => bullet.y > 0);
    bullets.forEach(bullet => bullet.y -= 50);

    // check for collisions
    bullets.forEach(bullet => {
      enemies.forEach(enemy => {
        if (bullet.x < enemy.x + 50 && bullet.x + 5 > enemy.x && bullet.y < enemy.y + 50 && bullet.y + 10 > enemy.y) {
          enemy.alive = false;
          score += 10;
          bullet.y = 0;
        }
      });
    });

    // move enemies
    let leftmost = right_bound - margin;
    let rightmost = left_bound + margin;
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
      if (left_breach < left_bound + margin) {
        let limit = leftmost - left_bound - margin;
        offset = limit - enemy_delta;
      }
    }
    if (enemy_moving == RIGHT) {
      if (right_breach > right_bound - margin) {
        let limit = right_bound - margin - rightmost_edge;
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
    if (enemy_moving == LEFT && left_breach <= left_bound + margin) {
      enemy_moving = RIGHT;
    } else if (enemy_moving == RIGHT && right_breach >= right_bound - margin) {
      enemy_moving = LEFT;
    }

    // remove eliminated enemies
    enemies = enemies.filter(enemy => enemy.alive);
  };

  const shoot = () => {
    bullets.push({ x: player.x + 22, y: player.y });
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      player_moving = LEFT;
    } else if (event.key === 'ArrowRight') {
      player_moving = RIGHT;
    } else if (event.key === ' ') {
      shoot();
    } else if (event.key === 'p') {
      if (playing) {
        pause();
      } else {
        play();
      }
    }
  };

  const draw = () => {
    if (canvas == null) {
      return;
    }
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // background
    ctx.fillStyle = 'gray';
    ctx.fillRect(0,0,left_bound,canvas.height);
    ctx.fillRect(right_bound,0,canvas.width - right_bound,canvas.height);

    // margin area (temporary)
    ctx.fillStyle = 'purple';
    ctx.fillRect(left_bound,0,margin,canvas.height);
    ctx.fillRect(right_bound - margin,0,margin,canvas.height);

    // draw player
    ctx.fillStyle = 'white';
    ctx.fillRect(player.x, player.y, 50, 20);

    // draw bullets
    bullets.forEach(bullet => {
      ctx.fillStyle = 'yellow';
      ctx.fillRect(bullet.x, bullet.y, 5, 10);
    });

    // draw enemies
    enemies.forEach(enemy => {
      if (enemy.alive) {
        ctx.fillStyle = 'red';
        ctx.fillRect(enemy.x, enemy.y, 50, 50);
      }
    });

    // draw score
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
  };

  const play = () => {
    playing = true;
    const interval = setInterval(() => {
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
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
    start();
  });
</script>

<canvas bind:this={canvas} width="{CANVAS_WIDTH}" height="{CANVAS_HEIGHT}"></canvas>

<style>
  canvas {
    background: black;
  }
</style>
