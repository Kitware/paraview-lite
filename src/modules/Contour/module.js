export default {
  name: 'Contour',
  icon: 'fingerprint',
  label: 'Contour',
  showInMenu(selectedSourceIds, proxyDataMap) {
    if (selectedSourceIds.length === 1 && proxyDataMap) {
      const sourceData = proxyDataMap[selectedSourceIds[0]];
      return sourceData
        ? sourceData.data.arrays.filter(
            (array) => array.location === 'POINTS' && array.size === 1
          ).length
        : false;
    }
    return false;
  },
};
