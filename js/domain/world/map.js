export function createMap(mapData) {
  const { id, width, height, capas, spawns, interactables = [], sistemas = [] } = mapData;

  function isInside(x, y) {
    return x >= 0 && x < width && y >= 0 && y < height;
  }

  return {
    id,
    width,
    height,
    getTileSuelo(x, y) {
      if (!isInside(x, y)) return null;
      return capas.suelo[y][x];
    },
    getTileColision(x, y) {
      if (!isInside(x, y)) return null;
      return capas.colision[y][x];
    },
    isSolid(x, y) {
      if (!isInside(x, y)) return true;
      return capas.colision[y][x] === '1';
    },
    isInside,
    getSpawn(nombre) {
      return spawns[nombre] || null;
    },
    getInteractables() {
      return interactables.map((i) => ({ ...i }));
    },
    getInteractablesResueltos(sistema) {
      return interactables.map((i) => ({
        ...i,
        componente: sistema ? sistema.findComponente(i.ref) : null,
      }));
    },
  };
}
