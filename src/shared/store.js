import { writable } from 'svelte/store';

const INITIAL_BULLET_DELTA = 10;
const INITIAL_BULLET_WIDTH = 5;
const INITIAL_BULLET_HEIGHT = 20;

export const bullet_store = writable({
    delta: INITIAL_BULLET_DELTA,
    width: INITIAL_BULLET_WIDTH,
    height: INITIAL_BULLET_HEIGHT,
});

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

export const enemy_store = writable(null);
