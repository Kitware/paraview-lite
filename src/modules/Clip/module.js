export default {
  name: 'Clip',
  icon: 'mdi-heart-half-full',
  label: 'Clip',
  showInMenu(selectedSourceIds) {
    return selectedSourceIds.length === 1;
  },
};
