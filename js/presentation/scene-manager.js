export function createSceneManager() {
  const scenes = new Map();
  let activeId = null;

  return {
    setScene(id, scene) {
      scenes.set(id, scene);
    },
    hasScene(id) {
      return scenes.has(id);
    },
    changeTo(id) {
      if (!scenes.has(id)) return false;
      activeId = id;
      const scene = scenes.get(id);
      if (scene && typeof scene.enter === 'function') scene.enter();
      return true;
    },
    getActiveId() {
      return activeId;
    },
    getActive() {
      return activeId ? scenes.get(activeId) : null;
    },
    setBase(scene) {
      scenes.set('base', scene);
      activeId = 'base';
    },
    update(dtMs) {
      const scene = this.getActive();
      if (scene) scene.update(dtMs);
    },
    render() {
      const scene = this.getActive();
      if (scene) scene.render();
    },
  };
}
