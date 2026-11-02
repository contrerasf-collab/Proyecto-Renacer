export const TILE_SIZE = 16;
export const CANVAS_WIDTH = 320;
export const CANVAS_HEIGHT = 240;
export const FPS = 60;
export const FIXED_DT_MS = 1000 / FPS;
export const MOVE_COOLDOWN_MS = 120;
export const MAX_EVENTS_PER_TICK = 200;

export const TILE = {
  WALL: 'W',
  FLOOR: '.',
  BUILDING: 'B',
  DOOR: 'D',
};

export const TILE_SOLID = new Set([TILE.WALL, TILE.BUILDING]);
