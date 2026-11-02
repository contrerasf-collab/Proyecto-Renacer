import { TILE_SIZE } from '../../core/constants.js';

export function createTilemapRender(renderer) {
  return {
    render(map) {
      const { ctx } = renderer;
      for (let y = 0; y < map.height; y++) {
        for (let x = 0; x < map.width; x++) {
          const solid = map.isSolid(x, y);
          ctx.fillStyle = solid ? '#2A323A' : '#5E7075';
          ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
      }
    },
  };
}
