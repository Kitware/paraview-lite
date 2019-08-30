export default {
  name: 'StreamTracer',
  icon: 'mdi-gesture',
  label: 'StreamTracer',
  showInMenu(selectedSourceIds, proxyDataMap) {
    if (selectedSourceIds.length === 1 && proxyDataMap) {
      const sourceData = proxyDataMap[selectedSourceIds[0]];
      return sourceData && sourceData.data
        ? sourceData.data.arrays.filter(
            (array) => array.location === 'POINTS' && array.size === 3
          ).length
        : false;
    }
    return false;
  },
};
