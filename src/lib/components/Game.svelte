<script>
  import { game_store } from '../../shared/game_store.js';
  import { hud_store, player_store, bullet_store } from '../../shared/store.js';
  import { onDestroy, onMount } from 'svelte';
  import * as Hud from './Hud.svelte';
  import * as Player from './Player.svelte';
  import * as Bullet from './Bullet.svelte';
  import * as Enemy from './Enemy.svelte';

  let canvas;
  let game_bounds;
  let hud;
  let player;
  let bullet_;

  const game_store_unsubscribe = game_store.bounds.subscribe(value => {
    game_bounds = value;
  });

  const hud_store_unsubscribe = hud_store.subscribe(value => {
    hud = value;
  });

  const player_store_unsubscribe = player_store.subscribe(value => {
    player = value;
  });

  const bullet_store_unsubscribe = bullet_store.subscribe(value => {
    bullet_ = value;
  });

  // gameplay attributes
  let started;
  let playing;
  let pausing;
  let game_interval; // for game loop timer

  onDestroy(() => {
    game_store_unsubscribe();
    hud_store_unsubscribe();
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
    // start the game
    if (!started) {
      if (event.key === 'k') {
        start();
      }
    }

    // active game playing
    if (started && !pausing) {
      if (event.key === 'ArrowLeft') {
        Player.go_left();
      } else if (event.key === 'ArrowRight') {
        Player.go_right();
      } else if (event.key === ' ') {
        Player.shoot();
      }
    }

    // pause/quit the game
    if (started) {
      if (event.key === 'Escape') {
        if (playing) {
          pause();
        } else {
          play();
        }
      } else if (event.key === 'q') {
        reset();
      }
    }
  };

  //================================================================================
  // set up the game ui elements
  //================================================================================

  const draw = () => {
    if (canvas == null) {
      return;
    }

    // initialize canvas
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

    // draw heads up display
    Hud.draw(ctx);

    // draw player
    Player.draw(ctx);

    // draw bullets
    Bullet.draw(ctx);

    // draw enemies
    Enemy.draw(ctx);
  };

  //================================================================================
  // interactive gameplay routines
  //================================================================================
  // play()
  // start()
  // pause()
  // reset()
  //================================================================================

  // central game loop
  const play = () => {
    started = true;
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

  // start the game
  function start() {
    Player.init();
    Enemy.create();
    play();
  }

  // pause the game
  function pause() {
    playing = false;
    pausing = true;
    clearInterval(game_interval)
  }

  // reset the game (on game end or hot reload)
  function reset() {
    hud.score = 0;
    started = false;
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
