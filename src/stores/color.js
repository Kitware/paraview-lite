export default {
  state: {
    arrays: {},
    lookupTableWindows: {},
    presets: {},
    presetNames: [],
  },
  getters: {
    PVL_COLOR_PRESETS(state) {
      return state.presets;
    },
    PVL_COLOR_ARRAYS(state) {
      return state.arrays;
    },
    PVL_COLOR_LOOKUP_TABLE_WINDOWS(state) {
      return state.lookupTableWindows;
    },
  },
  mutations: {
    PVL_COLOR_PRESET_NAMES_SET(state, names) {
      state.presetNames = names;
    },
    PVL_COLOR_PRESETS_SET(state, { image, name }) {
      state.presets = { ...state.presets, [name]: { image, name } };
    },
    PVL_COLOR_ARRAYS_SET(state, { image, range, name }) {
      state.arrays = { ...state.arrays, [name]: { image, range, name } };
    },
    PVL_COLOR_LOOKUP_TABLE_WINDOWS_SET(
      state,
      { name, visible, position, orientation }
    ) {
      const windowConfig = {
        ...state.lookupTableWindows[name],
        name,
        visible,
        position,
        orientation,
      };
      state.lookupTableWindows = {
        ...state.lookupTableWindows,
        [name]: windowConfig,
      };
    },
  },
  actions: {
    PVL_COLOR_FETCH_PRESET_NAMES(
      { getters, state, dispatch, commit },
      intervalTime = 500
    ) {
      const presetToFetch = state.presetNames.filter(
        (name) => !state.presets[name]
      );
      if (presetToFetch.length) {
        const client = getters.PVL_NETWORK_CLIENT;
        if (client) {
          const name = presetToFetch.pop();
          client
            .getRemote()
            .Lite.getLookupTablePreset(name, 255)
            .then(({ image }) => {
              commit('PVL_COLOR_PRESETS_SET', { name, image });
              setTimeout(() => {
                dispatch('PVL_COLOR_FETCH_PRESET_NAMES', intervalTime);
              }, intervalTime);
            })
            .catch(console.error);
        }
      }
    },
    PVL_COLOR_FETCH_PRESET_IMAGE({ getters, commit }, { name }) {
      const client = getters.PVL_NETWORK_CLIENT;
      if (client) {
        client
          .getRemote()
          .Lite.getLookupTablePreset(name, 255)
          .then(({ image }) => {
            commit('PVL_COLOR_PRESETS_SET', { name, image });
          });
      }
    },
    PVL_COLOR_FETCH_LOOKUP_IMAGE({ getters, commit }, name) {
      const client = getters.PVL_NETWORK_CLIENT;
      if (client) {
        client
          .getRemote()
          .Lite.getLookupTableForArrayName(name, 255)
          .then(({ image, range }) => {
            commit('PVL_COLOR_ARRAYS_SET', { name, image, range });
          });
      }
    },
    PVL_COLOR_APPLY_PRESET({ getters, dispatch }, { arrayName, presetName }) {
      const client = getters.PVL_NETWORK_CLIENT;
      if (client) {
        client
          .getRemote()
          .Lite.applyPreset(arrayName, presetName)
          .then(() => {
            dispatch('PVL_COLOR_FETCH_LOOKUP_IMAGE', arrayName);
          });
      }
    },
    PVL_COLOR_CUSTOM_DATA_RANGE({ getters }, { name, range }) {
      const client = getters.PVL_NETWORK_CLIENT;
      if (client) {
        client.getRemote().Lite.updateLookupTableRange(name, range);
      }
    },
    PVL_COLOR_BY(
      { getters, dispatch },
      {
        colorMode,
        representationId,
        arrayLocation,
        arrayName,
        vectorMode,
        vectorComponent,
        rescale,
      }
    ) {
      // console.log(
      //   'PVL_COLOR_BY',
      //   JSON.stringify(
      //     {
      //       colorMode,
      //       representationId,
      //       arrayLocation,
      //       arrayName,
      //       vectorMode,
      //       vectorComponent,
      //       rescale,
      //     },
      //     null,
      //     2
      //   )
      // );
      const client = getters.PVL_NETWORK_CLIENT;
      if (client) {
        client
          .getRemote()
          .ColorManager.colorBy(
            representationId,
            colorMode || 'SOLID',
            arrayLocation || 'POINTS',
            arrayName || '',
            vectorMode || 'Magnitude',
            vectorComponent || 0,
            rescale || false
          )
          .then(() => {
            dispatch('PVL_PROXY_DATA_FETCH', {
              proxyId: representationId,
              needUI: false,
            });
          })
          .catch(console.error);
      }
    },
  },
};
