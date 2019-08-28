import { Mutations } from 'paraview-lite/src/stores/types';

/* eslint-disable no-unused-vars */
const DEFAULT_VALUES = {
  showInMenu(proxyData) {
    return true;
  },
  priority: 0,
  label: 'No label',
  icon: 'bubble_chart',
};

function moduleSorting(a, b) {
  return a.priority - b.priority;
}

export default {
  state: {
    modules: [],
    active: null,
    moduleMap: {},
  },
  getters: {
    PVL_MODULES_LIST(state) {
      return state.modules;
    },
    PVL_MODULES_ACTIVE(state) {
      return state.active;
    },
    PVL_MODULES_MAP(state) {
      return state.moduleMap;
    },
  },
  mutations: {
    PVL_MODULES_ADD(
      state,
      { icon, label, component, isSource, showInMenu, priority, name }
    ) {
      const module = {};
      module.name = name;
      module.component = component;
      module.showInMenu = showInMenu || DEFAULT_VALUES.showInMenu;
      module.icon = icon || DEFAULT_VALUES.icon;
      module.label = label || DEFAULT_VALUES.label;
      module.priority = priority || DEFAULT_VALUES.priority;

      state.modules.push(module);
      state.modules.sort(moduleSorting);
      state.moduleMap[name] = module;
    },
    PVL_MODULES_ACTIVE_SET(state, module) {
      state.active = module;
    },
  },
  actions: {
    PVL_MODULES_ACTIVE_CLEAR({ commit }) {
      commit(Mutations.PVL_MODULES_ACTIVE_SET, null);
    },
    PVL_MODULES_ACTIVE_BY_NAME({ commit, state }, name) {
      commit(Mutations.PVL_MODULES_ACTIVE_SET, state.moduleMap[name]);
    },
  },
};
