import { mapState, mapActions } from 'vuex';
import Mousetrap from 'mousetrap';

import AboutBox from 'paraview-lite/src/components/core/AboutBox';
import ActionModules from 'paraview-lite/src/components/core/ActionModules';
import BrowserIssues from 'paraview-lite/src/components/core/BrowserIssues';
import ControlsDrawer from 'paraview-lite/src/components/core/ControlsDrawer';
import ErrorBox from 'paraview-lite/src/components/core/ErrorBox';
import FloatingLookupTable from 'paraview-lite/src/components/widgets/FloatingLookupTable';
import Landing from 'paraview-lite/src/components/core/Landing';
import LayoutView from 'paraview-lite/src/components/core/LayoutView';
import ProgressBar from 'paraview-lite/src/components/widgets/ProgressBar';
import shortcuts from 'paraview-lite/src/shortcuts';
import SvgIcon from 'paraview-lite/src/components/widgets/SvgIcon';
import { Actions } from 'paraview-lite/src/stores/types';

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

export default {
  name: 'App',
  components: {
    AboutBox,
    ActionModules,
    BrowserIssues,
    ControlsDrawer,
    ErrorBox,
    FloatingLookupTable,
    Landing,
    LayoutView,
    ProgressBar,
    SvgIcon,
  },
  props: {},
  data() {
    return {
      aboutDialog: false,
      errorDialog: false,
      controlsDrawer: false,
      errors: [],
    };
  },
  computed: mapState({
    client() {
      return this.$store.getters.PVL_NETWORK_CLIENT;
    },
    darkMode() {
      return this.$store.getters.PVL_APP_DARK_THEME;
    },
    busyPercent(state) {
      return state.busy.progress;
    },
    landingVisible: (state) => state.route === 'landing',
    smallScreen() {
      // vuetify xs is 600px, but our buttons collide at around 700.
      return this.$vuetify.breakpoint.smAndDown;
    },
    dialogType() {
      return this.smallScreen ? 'v-bottom-sheet' : 'v-dialog';
    },
    iconLogo() {
      if (this.darkMode) {
        return this.smallScreen ? 'lite-small-dark' : 'lite-dark';
      }
      return this.smallScreen ? 'lite-small' : 'lite';
    },
    floatingLookupTables() {
      return Object.values(
        this.$store.getters.PVL_COLOR_LOOKUP_TABLE_WINDOWS
      ).filter((l) => l.visible);
    },
    lookupTables() {
      return this.$store.getters.PVL_COLOR_ARRAYS;
    },
    dataFields() {
      const arrayRanges = {};
      const selectedProxies = this.$store.getters.PVL_PROXY_SELECTED_IDS;
      const dataMap = this.$store.getters.PVL_PROXY_DATA_MAP;
      const id = selectedProxies[0];
      const pData = dataMap[id];
      if (pData) {
        const arrays = pData.data.arrays;
        for (let i = 0; i < arrays.length; i++) {
          const { name, range } = arrays[i];
          arrayRanges[name] = range;
        }
      }
      return arrayRanges;
    },
  }),
  watch: {
    landingVisible(value) {
      // matches the mobile breakpoint for navigation-drawer
      if (!value && this.$vuetify.breakpoint.mdAndUp) {
        this.controlsDrawer = true;
      } else if (value) {
        this.controlsDrawer = false;
      }
    },
  },
  mounted() {
    // attach keyboard shortcuts
    shortcuts.forEach(({ key, action }) => {
      if (Actions[action]) {
        Mousetrap.bind(key, (e) => {
          e.preventDefault();
          this.$store.dispatch(Actions[action]);
        });
      }
    });

    // listen for errors
    window.addEventListener('error', this.recordError);

    // listen for errors via console.error
    if (window.console) {
      this.origConsoleError = window.console.error;
      window.console.error = (...args) => {
        if (args.length > 1) {
          this.recordError(args.join(' '));
        } else {
          this.recordError(args[0]);
        }
        return this.origConsoleError(...args);
      };
    }
  },
  beforeDestroy() {
    window.removeEventListener('error', this.recordError);

    if (this.origConsoleError) {
      window.console.error = this.origConsoleError;
    }

    shortcuts.forEach(({ key, action }) => {
      if (Actions[action]) {
        Mousetrap.unbind(key);
      }
    });
  },
  methods: Object.assign(
    {
      recordError(error) {
        this.errors.push(error);
      },
      toggleLanding() {
        if (!this.client) {
          return;
        }
        if (this.landingVisible) {
          this.showApp();
        } else {
          this.showLanding();
        }
      },
    },
    mapActions({
      showApp: Actions.PVL_APP_ROUTE_RUN,
      showLanding: Actions.PVL_APP_ROUTE_LANDING,
      connect: Actions.PVL_NETWORK_CONNECT,
    })
  ),
};
