import { Breakpoints } from 'paraview-lite/src/constants';

export default {
  name: 'Landing',
  data() {
    return {
      token: null,
      sessionURL: null,
      sessionManagerURL: null,
    };
  },
  computed: {
    smallScreen() {
      return this.$vuetify.breakpoint.width < Breakpoints.md;
    },
  },
  methods: {
    openSample(sample) {
      const urls = [];
      const names = [];
      for (let i = 0; i < sample.datasets.length; ++i) {
        urls.push(sample.datasets[i].url);
        names.push(sample.datasets[i].name);
      }
      this.$emit('open-urls', urls, names);
    },
    connectToSession() {
      if (this.sessionURL) {
        const config = {
          ...this.$store.getters.PVL_NETWORK_CONFIG,
          sessionURL: this.sessionURL,
        };
        if (this.token) {
          config.secret = this.token;
        }
        this.$store.commit('PVL_NETWORK_CONFIG_SET', config);
        this.$emit('connect');
      } else {
        console.error('No Session URL provided');
      }
    },
    startSession() {
      if (this.sessionManagerURL) {
        const config = {
          ...this.$store.getters.PVL_NETWORK_CONFIG,
          sessionManagerURL: this.sessionManagerURL,
        };
        if (this.token) {
          config.secret = this.token;
        }
        this.$store.commit('PVL_NETWORK_CONFIG_SET', config);
        this.$emit('connect');
      } else {
        console.error('No Session Manager URL provided');
      }
    },
  },
};
