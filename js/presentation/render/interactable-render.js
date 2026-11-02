import { TILE_SIZE } from '../../core/constants.js';

const COLOR_MEDIDA = '#F2D14E';
const COLOR_COMPONENTE = '#7BC8F6';
const COLOR_FRONTAL = '#F2B134';
const COLOR_SWITCH = '#2A323A';
const COLOR_SWITCH_BORDE = '#7BC8F6';
const COLOR_TEXTO = '#E8EEF0';
const COLOR_LAMP_ON = '#FFE27A';
const COLOR_LAMP_OFF = '#3A444C';
const COLOR_FUENTE = '#F2B134';
const COLOR_CONDUCTOR = '#8A9AA3';

const COLOR_SONDA_ROJA = '#E05A5A';
const COLOR_SONDA_NEGRA = '#E8EEF0';
const COLOR_TIERRA = '#8A9AA3';

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

  function dibujarMarcaSonda(ctx, x, y, color, etiqueta, discontinua = false) {
    const cx = x * TILE_SIZE + TILE_SIZE / 2;
    const cy = y * TILE_SIZE + TILE_SIZE / 2;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, 6.2, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    if (discontinua) ctx.setLineDash([2, 2]);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.font = 'bold 7px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#14181C';
    ctx.strokeText(etiqueta, cx + 5, cy - 5);
    ctx.fillStyle = color;
    ctx.fillText(etiqueta, cx + 5, cy - 5);
    ctx.restore();
  }

  function dibujarComponente(ctx, it, estado, voltajes) {
    const px = it.x * TILE_SIZE;
    const py = it.y * TILE_SIZE;
    const tipo = it.componente ? it.componente.tipo : null;
    const compId = it.ref;
    const est = (estado && estado[compId]) || {};
    const voltajeEntrada = voltajes ? (voltajes.get(`${compId}.entrada`) ?? 0) : 0;

    if (tipo === 'carga' || compId === 'lamp_01') {
      const encendida = voltajeEntrada > 0 && est.roto !== true;
      ctx.fillStyle = encendida ? COLOR_LAMP_ON : COLOR_LAMP_OFF;
      ctx.fillRect(px + 3, py + 3, TILE_SIZE - 6, TILE_SIZE - 6);
      ctx.strokeStyle = '#14181C';
      ctx.lineWidth = 1;
      ctx.strokeRect(px + 3.5, py + 3.5, TILE_SIZE - 7, TILE_SIZE - 7);
      return;
    }

    if (tipo === 'interruptor' || compId === 'sw_01') {
      ctx.fillStyle = COLOR_SWITCH;
      ctx.fillRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);
      ctx.strokeStyle = COLOR_SWITCH_BORDE;
      ctx.lineWidth = 1;
      ctx.strokeRect(px + 2.5, py + 2.5, TILE_SIZE - 5, TILE_SIZE - 5);
      ctx.fillStyle = COLOR_TEXTO;
      ctx.font = '6px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const on = est.posicion === 'on';
      ctx.fillText(on ? 'ON' : 'OFF', px + TILE_SIZE / 2, py + TILE_SIZE / 2);
      return;
    }

    if (tipo === 'fuente') {
      ctx.fillStyle = COLOR_FUENTE;
      ctx.fillRect(px + 3, py + 5, TILE_SIZE - 6, 6);
      ctx.fillStyle = '#14181C';
      ctx.fillRect(px + 5, py + 7, 3, 2);
      ctx.fillRect(px + 9, py + 7, 3, 2);
      return;
    }

    if (tipo === 'conductor') {
      ctx.fillStyle = COLOR_CONDUCTOR;
      ctx.fillRect(px + 4, py + 6, TILE_SIZE - 8, 4);
      return;
    }

    ctx.fillStyle = COLOR_COMPONENTE;
    ctx.fillRect(px + 3, py + 3, TILE_SIZE - 6, TILE_SIZE - 6);
  }

  return {
    render({
      interactables,
      celdaFrontal,
      estado,
      voltajes,
      sondas = null,
      referencia = null,
    }) {
      const { ctx } = renderer;
      for (const it of interactables) {
        if (it.tipo === 'medida') {
          dibujarMedida(ctx, it.x, it.y);
          if (!it.nodo) continue;
          if (sondas && sondas.roja === it.nodo) {
            dibujarMarcaSonda(ctx, it.x, it.y, COLOR_SONDA_ROJA, 'R');
          } else if (sondas && sondas.negra === it.nodo) {
            dibujarMarcaSonda(ctx, it.x, it.y, COLOR_SONDA_NEGRA, 'N');
          } else if ((!sondas || !sondas.negra) && referencia === it.nodo) {
            dibujarMarcaSonda(ctx, it.x, it.y, COLOR_TIERRA, 'T', true);
          }
        } else {
          dibujarComponente(ctx, it, estado, voltajes);
        }
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
