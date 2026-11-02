import { TILE_SIZE } from '../../core/constants.js';

export function createSpriteRender(renderer) {
  return {
    renderPlayer(x, y, orientacion) {
      const { ctx } = renderer;
      const px = x * TILE_SIZE + 2;
      const py = y * TILE_SIZE + 2;
      const size = TILE_SIZE - 4;

      ctx.fillStyle = '#F2B134';
      ctx.fillRect(px, py, size, size);

      ctx.fillStyle = '#14181C';
      const cx = x * TILE_SIZE + TILE_SIZE / 2;
      const cy = y * TILE_SIZE + TILE_SIZE / 2;
      const bar = 4;

      if (orientacion === 'arriba') {
        ctx.fillRect(cx - bar / 2, py, bar, 2);
      } else if (orientacion === 'abajo') {
        ctx.fillRect(cx - bar / 2, py + size - 2, bar, 2);
      } else if (orientacion === 'izquierda') {
        ctx.fillRect(px, cy - bar / 2, 2, bar);
      } else if (orientacion === 'derecha') {
        ctx.fillRect(px + size - 2, cy - bar / 2, 2, bar);
      }
    },
  };
}
