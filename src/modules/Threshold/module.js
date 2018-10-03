export default {
  name: 'Threshold',
  icon: 'gradient',
  label: 'Threshold',
  showInMenu(selectedSourceIds, proxyDataMap) {
    if (selectedSourceIds.length === 1 && proxyDataMap) {
      const sourceData = proxyDataMap[selectedSourceIds[0]];
      return sourceData
        ? sourceData.data.arrays.filter(
            (array) => array.location !== 'FIELDS' && array.size === 1
          ).length
        : false;
    }
    return false;
  },
};
