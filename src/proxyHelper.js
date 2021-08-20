/* eslint-disable no-param-reassign */
function extractProperties(names, properties, result) {
  for (let i = 0; i < properties.length; i++) {
    if (properties[i].children) {
      extractProperties(names, properties[i].children, result);
    } else if (names.indexOf(properties[i].name) !== -1) {
      if (result[properties[i].name]) {
        result[properties[i].name].push({ ...properties[i] });
      } else {
        result[properties[i].name] = [{ ...properties[i] }];
      }
    }
  }
}

function objClone(item) {
  return { ...item };
}

function copyMap(src, dest) {
  Object.keys(src).forEach((key) => {
    dest[key] = src[key].map(objClone);
  });
}
/* eslint-enable no-param-reassign */

function defaultConvert(value) {
  if (Array.isArray(value)) {
    return value.slice();
  }
  return value;
}

function isDifferent(a, b) {
  if (a !== b) {
    if (Array.isArray(a)) {
      for (let i = 0; i < a.length; i++) {
        if (isDifferent(a[i], b[i])) {
          return true;
        }
      }
      return false;
    }
    return true;
  }
  // They are the same
  return false;
}

export function toBoolean(value) {
  return !!value;
}

export function bool2int(value) {
  return value ? 1 : 0;
}

export function getStep(min, max) {
  if (Number.isInteger(min) && Number.isInteger(max) && max - min > 10) {
    return 1;
  }
  let delta = max - min;
  let targetStep = 1;
  if (delta > 0) {
    while (delta > 0) {
      targetStep *= 10;
      delta /= 10;
    }
    return targetStep;
  }
  while (delta < 0) {
    targetStep /= 10;
    delta *= 10;
  }
  return targetStep;
}

// Expected structure
//
// {
//   [propNameForVue]: {
//     name: 'Background', // Server side property
//     autoApply: true/false
//     clientToServer(value) {},
//     serverToClient(value) {},
//   }
// }
//
// >>>>>
//
// {
//   computed: { [...] },
//   methods: {
//     apply(),
//     hasChange(),
//   },
//   created,
// }
export function generateComponentWithServerBinding(
  proxyNameToCreate, // Provide null if not expected to create new proxy
  proxyType,
  propMaps,
  componentDefinition
) {
  let store = null;
  let mtime = 0;
  const serverPropNames = Object.keys(propMaps).map((i) => propMaps[i].name);
  const serverState = {};
  const localState = {};
  const changeSet = [];
  const computed = {
    isNetworkBusy() {
      return this.$store.getters.PVL_BUSY_COUNT;
    },
    activeSourceId() {
      return this.$store.getters.PVL_PROXY_SELECTED_IDS[0];
    },
    activeViewId() {
      return this.$store.getters.PVL_VIEW_ID;
    },
    activeRepresentationId() {
      return this.$store.getters.PVL_PROXY_SOURCE_TO_REPRESENTATION_MAP[
        this.$store.getters.PVL_PROXY_SELECTED_IDS[0]
      ];
    },
    activeProxyData() {
      const id = this[`active${proxyType}Id`];
      const proxyData = this.$store.getters.PVL_PROXY_DATA_MAP;

      if (!id) {
        // console.log(proxyType, 'No id available to update state');
        return null;
      }

      if (!proxyData || !proxyData[id]) {
        // console.log(proxyType, 'no proxy data for id', id, this.proxyData);
        return null;
      }
      return proxyData[id];
    },
    inputBounds() {
      if (this.create) {
        return this.activeProxyData.data.bounds;
      }
      const myId = this.activeProxyData.id;
      const nodeInfo = this.$store.getters.PVL_PROXY_PIPELINE.find(
        (n) => n.id === myId
      );
      const parentId = nodeInfo.parent;
      const proxyData = this.$store.getters.PVL_PROXY_DATA_MAP;
      if (!proxyData || !proxyData[parentId]) {
        // Fallback
        return [-1, 1, -1, 1, -1, 1];
      }
      return proxyData[parentId].data.bounds;
    },
    inputArrays() {
      const sourceId = this.activeSourceId;
      const proxyData = this.$store.getters.PVL_PROXY_DATA_MAP;
      const nodeInfo = this.$store.getters.PVL_PROXY_PIPELINE.find(
        (n) => n.id === sourceId
      );
      if (!proxyData || !proxyData[sourceId]) {
        return [];
      }

      if (this.create) {
        return proxyData[sourceId].data.arrays;
      }

      if (proxyType === 'Representation') {
        return proxyData[sourceId].data.arrays;
      }

      const idToUse = nodeInfo.parent === '0' ? sourceId : nodeInfo.parent;
      if (!nodeInfo || !proxyData[idToUse]) {
        return [];
      }
      return proxyData[idToUse].data.arrays;
    },
    ...componentDefinition.computed,
  };

  function refreshState() {
    // Create simple dependancy between method call and getters
    this.mtime = mtime++;

    const proxyData = this.activeProxyData;
    if (!proxyData) {
      return;
    }

    // Reset state
    const keys = Object.keys(serverState);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      delete serverState[key];
      delete localState[key];
    }

    if (this.create) {
      // Reset props to default
      Object.keys(propMaps).forEach((key) => {
        serverState[propMaps[key].name] = [
          {
            id: '0',
            value: propMaps[key].default,
            subProxy: propMaps[key].subProxy,
            label: propMaps[key].label || propMaps[key].name,
          },
        ];
      });
      copyMap(serverState, localState);
      return;
    }

    extractProperties(serverPropNames, proxyData.properties, serverState);
    copyMap(serverState, localState);
  }

  function hasChange() {
    changeSet.length = 0;
    for (let i = 0; i < serverPropNames.length; i++) {
      const key = serverPropNames[i];
      if (
        localState[key] &&
        serverState[key] &&
        isDifferent(localState[key][0].value, serverState[key][0].value)
      ) {
        // console.log('hasChange', key, localState[key], serverState[key]);
        for (let j = 0; j < localState[key].length; j++) {
          changeSet.push(localState[key][j]);
        }
      }
    }
    // console.log('=>', changeSet.length);
    return changeSet.length;
  }

  let scheduledApply = null;

  function apply() {
    if (this.create) {
      return;
    }
    if (this.isNetworkBusy && !scheduledApply) {
      scheduledApply = setTimeout(() => {
        scheduledApply = null;
        apply.apply(this);
      }, 100);
    }
    if (this.isNetworkBusy < 3 && hasChange()) {
      // console.log('apply', JSON.stringify(changeSet, null, 2));
      store.dispatch('PVL_PROXY_UPDATE', changeSet);
      store.dispatch('PVL_PROXY_DATA_FETCH', {
        proxyId: this[`active${proxyType}Id`],
        needUI: false,
      });
    }
  }

  function reset() {
    copyMap(serverState, localState);
    this.mtime++;
  }

  // Fill computed fields
  Object.keys(propMaps).forEach((key) => {
    const propName = propMaps[key].name;
    const autoApply = propMaps[key].autoApply || false;
    const noAutoApply = propMaps[key].noAutoApply || false;
    const getFn = propMaps[key].serverToClient || defaultConvert;
    const setFn = propMaps[key].clientToServer || defaultConvert;
    computed[key] = {
      get() {
        // register dependency
        this.mtime; // eslint-disable-line
        return localState[propName]
          ? getFn(localState[propName][0].value)
          : getFn(propMaps[key].default);
      },
      set(value) {
        this.mtime++;
        const newValue = setFn(value);
        for (let i = 0; i < localState[propName].length; i++) {
          localState[propName][i].value = newValue;
        }

        if (autoApply || (this.autoApply && !noAutoApply)) {
          apply.apply(this);
        } else {
          this.$forceUpdate();
        }
      },
    };
  });

  const props = { ...componentDefinition.props };
  if (!props.create && !computed.create) {
    props.create = {
      type: Boolean,
      default: false,
    };
  }
  if (!props.autoApply && !computed.autoApply) {
    props.autoApply = {
      type: Boolean,
      default: false,
    };
  }

  return {
    ...componentDefinition,
    computed,
    props,
    data() {
      return { mtime: -1, ...componentDefinition.data.apply(this) };
    },
    methods: {
      getStep,
      apply,
      reset,
      hasChange,
      refreshState,
      ...(proxyNameToCreate
        ? {
            deleteProxy() {
              if (!this.create) {
                this.$store.dispatch('PVL_PROXY_DELETE', this.activeSourceId);
                this.$store.commit('PVL_PROXY_SELECTED_IDS_SET', []);
              } else {
                this.$store.dispatch('PVL_MODULES_ACTIVE_CLEAR');
              }
            },
            createProxy() {
              const initialValues = {};
              const subProxyValues = {};
              if (hasChange()) {
                Object.keys(localState).forEach((key) => {
                  for (let i = 0; i < localState[key].length; i++) {
                    if (!localState[key][i].subProxy) {
                      initialValues[localState[key][i].label] =
                        localState[key][i].value;
                    } else {
                      if (!subProxyValues[localState[key][i].subProxy]) {
                        subProxyValues[localState[key][i].subProxy] = {};
                      }
                      subProxyValues[localState[key][i].subProxy][
                        localState[key][i].label
                      ] = localState[key][i].value;
                    }
                  }
                });
              }

              this.$store.dispatch('PVL_PROXY_CREATE', {
                name: proxyNameToCreate,
                parentId: this.activeSourceId,
                initialValues,
                subProxyValues,
                skipDomain: !!hasChange(),
              });
            },
          }
        : null),
      ...componentDefinition.methods,
    },
    watch: {
      activeProxyData: refreshState,
      ...componentDefinition.watch,
    },
    created() {
      // Capture store inside closure
      store = this.$store;

      if (componentDefinition.created) {
        componentDefinition.created.apply(this);
      }
    },
    mounted() {
      this.refreshState();
      if (componentDefinition.mounted) {
        componentDefinition.mounted.apply(this);
      }
    },
  };
}
