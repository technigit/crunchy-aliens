import { writable } from 'svelte/store';

const AUTOSTART = true;

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const FPS = 60;
const TIME_INTERVAL = 1000/FPS;

const LEFT = 0;
const RIGHT = 1;
const STOP = -1;

// stop movement after this many frames
const MOVE_COOLDOWN = 20;

// wait this many frames before firing again
const FIRE_COOLDOWN = 10; // frames

// limit the number of bullets at any time
const FIRE_MAX = 10;

// left_bound: distance from canvas left
// right_bound: distance from canvas left
// top_bound: distance from canvas top
// bottom_bound: distance from canvas bottom
const INITIAL_LEFT_BOUND = 50;
const INITIAL_RIGHT_BOUND = CANVAS_WIDTH - INITIAL_LEFT_BOUND;

const INITIAL_TOP_BOUND = 50;
const INITIAL_BOTTOM_BOUND = 50;

// horizontal/vertical margins around the playing space, within the bounds
const INITIAL_HMARGIN = 10;
const INITIAL_VMARGIN = 10;

export const game_store = {
    AUTOSTART: AUTOSTART,

    CANVAS_WIDTH: CANVAS_WIDTH,
    CANVAS_HEIGHT: CANVAS_HEIGHT,

    TIME_INTERVAL: TIME_INTERVAL,

    LEFT: LEFT,
    RIGHT: RIGHT,
    STOP: STOP,

    MOVE_COOLDOWN: MOVE_COOLDOWN,

    FIRE_COOLDOWN: FIRE_COOLDOWN,

    FIRE_MAX: FIRE_MAX,

    bounds: writable({
        left_bound: INITIAL_LEFT_BOUND,
        right_bound: INITIAL_RIGHT_BOUND,

        top_bound: INITIAL_TOP_BOUND,
        bottom_bound: INITIAL_BOTTOM_BOUND,

        hmargin: INITIAL_HMARGIN,
        vmargin: INITIAL_VMARGIN,
    }),
};
