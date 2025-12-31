import * as constants from './constants.js';
import { writable } from 'svelte/store';

//================================================================================
// game
//================================================================================

// left_bound: distance from canvas left
// right_bound: distance from canvas left
const INITIAL_LEFT_BOUND = 50;
const INITIAL_RIGHT_BOUND = constants.CANVAS_WIDTH - INITIAL_LEFT_BOUND;

// top_bound: distance from canvas top
// bottom_bound: distance from canvas bottom
const INITIAL_TOP_BOUND = 50;
const INITIAL_BOTTOM_BOUND = 50;

// horizontal/vertical margins around the playing space, within the bounds
const INITIAL_HMARGIN = 10;
const INITIAL_VMARGIN = 10;

export const game_store = {
    AUTOSTART: constants.AUTOSTART,

    CANVAS_WIDTH: constants.CANVAS_WIDTH,
    CANVAS_HEIGHT: constants.CANVAS_HEIGHT,

    FRAME_TIME_INTERVAL: 1000/constants.FPS,
    UPDATE_TIME_INTERVAL: 1000/constants.UPS,

    LEFT: constants.LEFT,
    RIGHT: constants.RIGHT,
    STOP: constants.STOP,

    bounds: writable({
        left_bound: INITIAL_LEFT_BOUND,
        right_bound: INITIAL_RIGHT_BOUND,

        top_bound: INITIAL_TOP_BOUND,
        bottom_bound: INITIAL_BOTTOM_BOUND,

        hmargin: INITIAL_HMARGIN,
        vmargin: INITIAL_VMARGIN,
    }),
};

//================================================================================
// heads up display
//================================================================================

// HUD values
const INITIAL_SCORE = 0;
const INITIAL_HIGH_SCORE = 0;
const INITIAL_LIVES = 3;
const INITIAL_WINS = 0;
const INITIAL_PLAYER_UP = 1;

export const hud_store = writable({
    score: INITIAL_SCORE,
    high_score: INITIAL_HIGH_SCORE,
    lives: INITIAL_LIVES,
    wins: INITIAL_WINS,
    player_up: INITIAL_PLAYER_UP,
});

//================================================================================
// bullets
//================================================================================

// move bullet this many pixels
const INITIAL_BULLET_DELTA = 10;

// wait this many updates before moving the bullet again
const INITIAL_BULLET_TAU = 2;

// bullet dimensions
const INITIAL_BULLET_WIDTH = 5;
const INITIAL_BULLET_HEIGHT = 20;

// wait this many frames before firing again
const INITIAL_FIRE_COOLDOWN = 10;

// limit the number of bullets at any time
const INITIAL_FIRE_MAX = 10;

export const bullet_store = writable({
    delta: INITIAL_BULLET_DELTA,
    tau: INITIAL_BULLET_TAU,
    width: INITIAL_BULLET_WIDTH,
    height: INITIAL_BULLET_HEIGHT,
    fire_cooldown: INITIAL_FIRE_COOLDOWN,
    fire_max: INITIAL_FIRE_MAX,
});

//================================================================================
// player
//================================================================================

// move player this many pixels
const INITIAL_PLAYER_DELTA = 5;

// wait this many updates before moving the player again
const INITIAL_PLAYER_TAU = 2;

// player dimensions
const INITIAL_PLAYER_WIDTH = 50;
const INITIAL_PLAYER_HEIGHT = 20;

// player gun parameters
const INITIAL_PLAYER_GUNPOINT_X = INITIAL_PLAYER_WIDTH / 2 - INITIAL_BULLET_WIDTH / 2;
const INITIAL_PLAYER_GUNPOINT_Y = 0;
const INITIAL_PLAYER_GUNHEIGHT = 20;

// stop movement after this many frames
const INITIAL_MOVE_COOLDOWN = 20;

export const player_store = writable({
    delta: INITIAL_PLAYER_DELTA,
    tau: INITIAL_PLAYER_TAU,
    width: INITIAL_PLAYER_WIDTH,
    height: INITIAL_PLAYER_HEIGHT,
    gunpoint_x: INITIAL_PLAYER_GUNPOINT_X,
    gunpoint_y: INITIAL_PLAYER_GUNPOINT_Y,
    gunheight: INITIAL_PLAYER_GUNHEIGHT,
    move_cooldown: INITIAL_MOVE_COOLDOWN,
});

//================================================================================
// enemies
//================================================================================

// enemy formation configuration
const INITIAL_NUM_ENEMIES = 30;
const INITIAL_ENEMY_COLUMN_WIDTH = 60;
const INITIAL_ENEMY_ROW_HEIGHT = 70;
const INITIAL_MAX_ENEMY_COLUMNS = 5;

// move enemies this many pixels
const INITIAL_ENEMY_DELTA = 2;

// wait this many updates before moving the enemies again
const INITIAL_ENEMY_TAU = 2;

// enemy dimensions
const INITIAL_ENEMY_WIDTH = 50;
const INITIAL_ENEMY_HEIGHT = 50;

export const enemy_store = writable({
    num_enemies: INITIAL_NUM_ENEMIES,
    column_width: INITIAL_ENEMY_COLUMN_WIDTH,
    row_height: INITIAL_ENEMY_ROW_HEIGHT,
    max_columns: INITIAL_MAX_ENEMY_COLUMNS,
    delta: INITIAL_ENEMY_DELTA,
    tau: INITIAL_ENEMY_TAU,
    width: INITIAL_ENEMY_WIDTH,
    height: INITIAL_ENEMY_HEIGHT,
    enemies: [],
});
