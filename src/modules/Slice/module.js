export default {
  name: 'Slice',
  icon: 'texture',
  label: 'Cut',
  showInMenu(selectedSourceIds) {
    return selectedSourceIds.length === 1;
  },
};
