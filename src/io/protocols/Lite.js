/* eslint-disable arrow-body-style */
export default function createMethods(session) {
  return {
    getCamera: (viewId = '-1') =>
      session.call('paraview.lite.camera.get', [viewId]),
    getProxyName: (id = '-1') => session.call('paraview.lite.proxy.name', [id]),
    getLookupTableForArrayName: (arrayName, sample = 255) =>
      session.call('paraview.lite.lut.get', [arrayName, sample]),
    updateLookupTableRange: (arrayName, dataRange) =>
      session.call('paraview.lite.lut.range.update', [arrayName, dataRange]),
    getLookupTablePreset: (name, sample = 255) =>
      session.call('paraview.lite.lut.preset', [name, sample]),
    applyPreset: (arrayName, presetName) =>
      session.call('paraview.lite.lut.set.preset', [arrayName, presetName]),
    updateLineContext: (visible = false, p1 = [0, 0, 0], p2 = [1, 1, 1]) =>
      session.call('paraview.lite.context.line.set', [visible, p1, p2]),
  };
}
