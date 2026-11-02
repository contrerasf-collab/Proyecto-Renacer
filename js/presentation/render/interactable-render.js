import { TILE_SIZE } from '../../core/constants.js';

const COLOR_MEDIDA = '#F2D14E';
const COLOR_COMPONENTE = '#7BC8F6';
const COLOR_FRONTAL = '#F2B134';
const COLOR_SWITCH = '#2A323A';
const COLOR_TEXTO = '#E8EEF0';
const COLOR_LAMP_ON = '#FFE27A';
const COLOR_LAMP_OFF = '#3A444C';

export function createInteractableRender(renderer) {
  function dibujarMedida(ctx, x, y) {
    const cx = x * TILE_SIZE + TILE_SIZE / 2;
    const cy = y * TILE_SIZE + TILE_SIZE / 2;
    ctx.fillStyle = COLOR_MEDIDA;
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#14181C';
    ctx.beginPath();
    ctx.arc(cx, cy, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  function dibujarComponente(ctx, it, estado, voltajes) {
    const px = it.x * TILE_SIZE;
    const py = it.y * TILE_SIZE;
    const encendida =
      (voltajes.get('lamp_01.entrada') ?? 0) > 0 && !(estado.lamp_01 && estado.lamp_01.roto);

    if (it.ref === 'lamp_01') {
      ctx.fillStyle = encendida ? COLOR_LAMP_ON : COLOR_LAMP_OFF;
      ctx.fillRect(px + 3, py + 3, TILE_SIZE - 6, TILE_SIZE - 6);
      ctx.strokeStyle = '#14181C';
      ctx.lineWidth = 1;
      ctx.strokeRect(px + 3.5, py + 3.5, TILE_SIZE - 7, TILE_SIZE - 7);
      return;
    }

    if (it.ref === 'sw_01') {
      ctx.fillStyle = COLOR_SWITCH;
      ctx.fillRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);
      ctx.fillStyle = COLOR_TEXTO;
      ctx.font = '6px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const on = estado.sw_01 && estado.sw_01.posicion === 'on';
      ctx.fillText(on ? 'ON' : 'OFF', px + TILE_SIZE / 2, py + TILE_SIZE / 2);
      return;
    }

    ctx.fillStyle = COLOR_COMPONENTE;
    ctx.fillRect(px + 3, py + 3, TILE_SIZE - 6, TILE_SIZE - 6);
  }

  return {
    render({ interactables, celdaFrontal, estado, voltajes }) {
      const { ctx } = renderer;
      for (const it of interactables) {
        if (it.tipo === 'medida') dibujarMedida(ctx, it.x, it.y);
        else dibujarComponente(ctx, it, estado, voltajes);
      }

      if (celdaFrontal) {
        ctx.strokeStyle = COLOR_FRONTAL;
        ctx.lineWidth = 2;
        ctx.strokeRect(
          celdaFrontal.x * TILE_SIZE + 1,
          celdaFrontal.y * TILE_SIZE + 1,
          TILE_SIZE - 2,
          TILE_SIZE - 2
        );
      }
    },
  };
}
