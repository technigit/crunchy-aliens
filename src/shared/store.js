import { writable } from 'svelte/store';

//================================================================================
// bullets
//================================================================================

const INITIAL_BULLET_DELTA = 10;
const INITIAL_BULLET_WIDTH = 5;
const INITIAL_BULLET_HEIGHT = 20;

export const bullet_store = writable({
    delta: INITIAL_BULLET_DELTA,
    width: INITIAL_BULLET_WIDTH,
    height: INITIAL_BULLET_HEIGHT,
});

//================================================================================
// player
//================================================================================

const INITIAL_PLAYER_DELTA = 5;
const INITIAL_PLAYER_WIDTH = 50;
const INITIAL_PLAYER_HEIGHT= 20;
const INITIAL_PLAYER_GUNPOINT = INITIAL_PLAYER_WIDTH / 2 - INITIAL_BULLET_WIDTH / 2;

export const player_store = writable({
    delta: INITIAL_PLAYER_DELTA,
    width: INITIAL_PLAYER_WIDTH,
    height: INITIAL_PLAYER_HEIGHT,
    gunpoint: INITIAL_PLAYER_GUNPOINT,
});

//================================================================================
// enemies
//================================================================================

const INITIAL_NUM_ENEMIES = 30;
const INITIAL_ENEMY_COLUMN_WIDTH = 60;
const INITIAL_ENEMY_ROW_HEIGHT = 70;
const INITIAL_MAX_ENEMY_COLUMNS = 5;
const INITIAL_ENEMY_DELTA = 2;
const INITIAL_ENEMY_WIDTH = 50;
const INITIAL_ENEMY_HEIGHT = 50;

export const enemy_store = writable({
    num_enemies: INITIAL_NUM_ENEMIES,
    column_width: INITIAL_ENEMY_COLUMN_WIDTH,
    row_height: INITIAL_ENEMY_ROW_HEIGHT,
    max_columns: INITIAL_MAX_ENEMY_COLUMNS,
    delta: INITIAL_ENEMY_DELTA,
    width: INITIAL_ENEMY_WIDTH,
    height: INITIAL_ENEMY_HEIGHT,
    enemies: [],
});
