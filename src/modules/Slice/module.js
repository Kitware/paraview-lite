export default {
  name: 'Slice',
  icon: 'mdi-texture',
  label: 'Cut',
  showInMenu(selectedSourceIds) {
    return selectedSourceIds.length === 1;
  },
};
