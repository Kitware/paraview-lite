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
  'PVL_BUSY_PROGRESS',
  'PVL_BUSY_COUNT',

  // color
  'PVL_COLOR_PRESETS',
  'PVL_COLOR_ARRAYS',
  'PVL_COLOR_LOOKUP_TABLE_WINDOWS',

  // index
  'PVL_APP_AUTO_APPLY',
  'PVL_APP_DARK_THEME',

  // modules
  'PVL_MODULES_LIST',
  'PVL_MODULES_ACTIVE',
  'PVL_MODULES_MAP',

  // network
  'PVL_NETWORK_CLIENT',
  'PVL_NETWORK_CONFIG',

  // proxy
  'PVL_PROXY_SELECTED_IDS',
  'PVL_PROXY_PIPELINE',
  'PVL_PROXY_TO_MODULE_MAP',
  'PVL_PROXY_SOURCE_TO_REPRESENTATION_MAP',
  'PVL_PROXY_DATA_MAP',
  'PVL_PROXY_NAME_MAP',

  // time
  'PVL_TIME_VALUES',
  'PVL_TIME_ACTIVE_IDX',
  'PVL_TIME_ACTIVE_VALUE',

  // view
  'PVL_VIEW_ID',
  'PVL_VIEW_PROXY',
  'PVL_VIEW_STATS',
  'PVL_VIEW_QUALITY_STILL',
  'PVL_VIEW_QUALITY_INTERACTIVE',
  'PVL_VIEW_RATIO_STILL',
  'PVL_VIEW_RATIO_INTERACTIVE',
  'PVL_VIEW_FPS_MAX',
  'PVL_VIEW_MOUSE_THROTTLE',
]);

// ----------------------------------------------------------------------------
// Mutations
// ----------------------------------------------------------------------------

export const Mutations = objEnum([
  // busy
  'PVL_BUSY_PROGRESS_SET',
  'PVL_BUSY_COUNT_SET',

  // color
  'PVL_COLOR_ARRAYS_SET',
  'PVL_COLOR_LOOKUP_TABLE_WINDOWS_SET',
  'PVL_COLOR_PRESET_NAMES_SET',
  'PVL_COLOR_PRESETS_SET',

  // index
  'PVL_APP_ROUTE_SET',
  'PVL_APP_AUTO_APPLY_SET',
  'PVL_APP_DARK_THEME_SET',

  // modules
  'PVL_MODULES_ADD',
  'PVL_MODULES_ACTIVE_SET',

  // network
  'PVL_NETWORK_CLIENT_SET',
  'PVL_NETWORK_CONFIG_SET',

  // proxy
  'PVL_PROXY_SELECTED_IDS_SET',
  'PVL_PROXY_PIPELINE_SET',
  'PVL_PROXY_MODULE_BIND',
  'PVL_PROXY_SOURCE_TO_REPRESENTATION_SET',
  'PVL_PROXY_DATA_SET',
  'PVL_PROXY_NAME_SET',

  // time
  'PVL_TIME_VALUES_SET',
  'PVL_TIME_ACTIVE_IDX_SET',

  // view
  'PVL_VIEW_ID_SET',
  'PVL_VIEW_STATS_SET',
  'PVL_VIEW_QUALITY_STILL_SET',
  'PVL_VIEW_QUALITY_INTERACTIVE_SET',
  'PVL_VIEW_RATIO_STILL_SET',
  'PVL_VIEW_RATIO_INTERACTIVE_SET',
  'PVL_VIEW_FPS_MAX_SET',
  'PVL_VIEW_MOUSE_THROTTLE_SET',
  'PVL_VIEW_PVL_PROXY_SET',
]);

// ----------------------------------------------------------------------------
// Actions
// ----------------------------------------------------------------------------

export const Actions = objEnum([
  // busy
  'PVL_BUSY_UPDATE_PROGRESS',

  // color
  'PVL_COLOR_BY',
  'PVL_COLOR_CUSTOM_DATA_RANGE',
  'PVL_COLOR_FETCH_LOOKUP_IMAGE',
  'PVL_COLOR_FETCH_PRESET_IMAGE',
  'PVL_COLOR_FETCH_PRESET_NAMES',
  'PVL_COLOR_APPLY_PRESET',

  // contexts
  'PVL_CONTEXTS_LINE',

  // index
  'PVL_APP_ROUTE_LANDING',
  'PVL_APP_ROUTE_RUN',

  // modules
  'PVL_MODULES_ACTIVE_CLEAR',
  'PVL_MODULES_ACTIVE_BY_NAME',

  // network
  'PVL_NETWORK_CONNECT',

  // proxy
  'PVL_PROXY_CREATE',
  'PVL_PROXY_UPDATE',
  'PVL_PROXY_DELETE',
  'PVL_PROXY_NAME_FETCH',
  'PVL_PROXY_PIPELINE_FETCH',
  'PVL_PROXY_DATA_FETCH',
  'PVL_PROXY_DATA_REFETCH',

  // time
  'PVL_TIME_FETCH_VALUES',
  'PVL_TIME_ACTIVATE_INDEX',
  'PVL_TIME_FETCH_ACTIVE_INDEX',

  // view
  'PVL_VIEW_UPDATE_CAMERA',
  'PVL_VIEW_RESET_CAMERA',
  'PVL_VIEW_ROLL_LEFT',
  'PVL_VIEW_ROLL_RIGHT',
  'PVL_VIEW_UPDATE_ORIENTATION',
  'PVL_VIEW_RENDER',
]);

// ----------------------------------------------------------------------------

export default {
  Actions,
  Getters,
  Mutations,
};
