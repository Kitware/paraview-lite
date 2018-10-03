import SvgIcon from 'paraview-lite/src/components/widgets/SvgIcon';

// ----------------------------------------------------------------------------

export default {
  name: 'AboutBox',
  components: {
    SvgIcon,
  },
  data() {
    return {
      version: window.PARAVIEW_LITE_VERSION || 'not available',
    };
  },
  computed: {
    darkMode() {
      return this.$store.getters.APP_DARK_THEME;
    },
  },
};
