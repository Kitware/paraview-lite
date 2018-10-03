export default {
  name: 'Clip',
  icon: 'flip',
  label: 'Clip',
  showInMenu(selectedSourceIds) {
    return selectedSourceIds.length === 1;
  },
};
