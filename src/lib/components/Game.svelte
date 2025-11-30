<script>
  import { player_store, bullet_store } from '../../shared/store.js';
  import { game_store } from '../../shared/game_store.js';
  import { onDestroy, onMount } from 'svelte';
  import * as Player from './Player.svelte';
  import * as Bullet from './Bullet.svelte';
  import * as Enemy from './Enemy.svelte';

  let canvas;
  let game_bounds;
  let player;
  let bullet_;

  const game_store_unsubscribe = game_store.bounds.subscribe(value => {
    game_bounds = value;
  });

  const player_store_unsubscribe = player_store.subscribe(value => {
    player = value;
  });

  const bullet_store_unsubscribe = bullet_store.subscribe(value => {
    bullet_ = value;
  });

  // gameplay attributes
  let score = 0;
  let playing;
  let pausing;
  let game_interval; // for game loop timer

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
    bullet_store_unsubscribe();
    reset();
  });

  //================================================================================
  // update the game area for the next frame
  //================================================================================

  const update = () => {
    Player.move();
    Bullet.move();
    Enemy.move();
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
      Player.shoot();
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
      reset();
    } else if (event.key === 'Z') {
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
    Bullet.draw(ctx);

    // draw enemies
    Enemy.draw(ctx);

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
  // reset()
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
    Enemy.create();
    play();
  }

  function pause() {
    playing = false;
    pausing = true;
    clearInterval(game_interval)
  }

  function reset() {
    score = 0;
    playing = false;
    pausing = false;
    Enemy.clear();
    Bullet.clear();
    clearInterval(game_interval);
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
