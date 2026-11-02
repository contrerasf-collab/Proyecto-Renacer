export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  return {
    ctx,
    clear(color = '#000000') {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    },
    size() {
      return { width: canvas.width, height: canvas.height };
    },
  };
}
