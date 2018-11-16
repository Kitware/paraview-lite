function objEnum(names) {
  const obj = {};
  names.forEach((name) => {
    obj[name] = name;
  });
  return obj;
}

// ----------------------------------------------------------------------------
// Getters
// ----------------------------------------------------------------------------

export const Getters = objEnum([
  // busy
  'BUSY_PROGRESS',
  'BUSY_COUNT',

  // color
  'COLOR_PRESETS',
  'COLOR_ARRAYS',
  'COLOR_LOOKUP_TABLE_WINDOWS',

  // index
  'APP_AUTO_APPLY',
  'APP_DARK_THEME',

  // modules
  'MODULES_LIST',
  'MODULES_ACTIVE',
  'MODULES_MAP',

  // network
  'NETWORK_CLIENT',
  'NETWORK_CONFIG',

  // proxy
  'PROXY_SELECTED_IDS',
  'PROXY_PIPELINE',
  'PROXY_TO_MODULE_MAP',
  'PROXY_SOURCE_TO_REPRESENTATION_MAP',
  'PROXY_DATA_MAP',
  'PROXY_NAME_MAP',

  // time
  'TIME_VALUES',
  'TIME_ACTIVE_IDX',
  'TIME_ACTIVE_VALUE',

  // view
  'VIEW_ID',
  'VIEW_PROXY',
  'VIEW_STATS',
  'VIEW_QUALITY_STILL',
  'VIEW_QUALITY_INTERACTIVE',
  'VIEW_RATIO_STILL',
  'VIEW_RATIO_INTERACTIVE',
  'VIEW_FPS_MAX',
  'VIEW_MOUSE_THROTTLE',
]);

// ----------------------------------------------------------------------------
// Mutations
// ----------------------------------------------------------------------------

export const Mutations = objEnum([
  // busy
  'BUSY_PROGRESS_SET',
  'BUSY_COUNT_SET',

  // color
  'COLOR_ARRAYS_SET',
  'COLOR_LOOKUP_TABLE_WINDOWS_SET',
  'COLOR_PRESET_NAMES_SET',
  'COLOR_PRESETS_SET',

  // index
  'APP_ROUTE_SET',
  'APP_AUTO_APPLY_SET',
  'APP_DARK_THEME_SET',

  // modules
  'MODULES_ADD',
  'MODULES_ACTIVE_SET',

  // network
  'NETWORK_CLIENT_SET',
  'NETWORK_CONFIG_SET',

  // proxy
  'PROXY_SELECTED_IDS_SET',
  'PROXY_PIPELINE_SET',
  'PROXY_MODULE_BIND',
  'PROXY_SOURCE_TO_REPRESENTATION_SET',
  'PROXY_DATA_SET',
  'PROXY_NAME_SET',

  // time
  'TIME_VALUES_SET',
  'TIME_ACTIVE_IDX_SET',

  // view
  'VIEW_ID_SET',
  'VIEW_STATS_SET',
  'VIEW_QUALITY_STILL_SET',
  'VIEW_QUALITY_INTERACTIVE_SET',
  'VIEW_RATIO_STILL_SET',
  'VIEW_RATIO_INTERACTIVE_SET',
  'VIEW_FPS_MAX_SET',
  'VIEW_MOUSE_THROTTLE_SET',
  'VIEW_PROXY_SET',
]);

// ----------------------------------------------------------------------------
// Actions
// ----------------------------------------------------------------------------

export const Actions = objEnum([
  // busy
  'BUSY_UPDATE_PROGRESS',

  // color
  'COLOR_BY',
  'COLOR_CUSTOM_DATA_RANGE',
  'COLOR_FETCH_LOOKUP_IMAGE',
  'COLOR_FETCH_PRESET_IMAGE',
  'COLOR_FETCH_PRESET_NAMES',
  'COLOR_APPLY_PRESET',

  // contexts
  'CONTEXTS_LINE',

  // index
  'APP_ROUTE_LANDING',
  'APP_ROUTE_RUN',

  // modules
  'MODULES_ACTIVE_CLEAR',
  'MODULES_ACTIVE_BY_NAME',

  // network
  'NETWORK_CONNECT',

  // proxy
  'PROXY_CREATE',
  'PROXY_UPDATE',
  'PROXY_DELETE',
  'PROXY_NAME_FETCH',
  'PROXY_PIPELINE_FETCH',
  'PROXY_DATA_FETCH',
  'PROXY_DATA_REFETCH',

  // time
  'TIME_FETCH_VALUES',
  'TIME_ACTIVATE_INDEX',
  'TIME_FETCH_ACTIVE_INDEX',

  // view
  'VIEW_UPDATE_CAMERA',
  'VIEW_RESET_CAMERA',
  'VIEW_ROLL_LEFT',
  'VIEW_ROLL_RIGHT',
  'VIEW_UPDATE_ORIENTATION',
  'VIEW_RENDER',
]);

// ----------------------------------------------------------------------------

export default {
  Actions,
  Getters,
  Mutations,
};
