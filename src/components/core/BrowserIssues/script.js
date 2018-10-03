const WARNING_KEY = 'BrowserIssues.suppressWarning';

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

function getBrowserIssues() {
  // FIXME
  if (Object.keys(this.issues).length && !this.suppressWarning) {
    this.dialog = true;
  }
}

// ----------------------------------------------------------------------------

function closeDialog() {
  if (this.suppressWarning && window.localStorage) {
    window.localStorage.setItem(WARNING_KEY, true);
  }
  this.dialog = false;
}

// ----------------------------------------------------------------------------

export default {
  name: 'BrowserIssues',
  data() {
    return {
      issues: {},
      dialog: false,
      dontShow: false,
      suppressWarning: false,
    };
  },
  created() {
    if (window.localStorage) {
      this.suppressWarning = !!window.localStorage.getItem(WARNING_KEY);
    }
  },
  mounted() {
    this.$nextTick(this.getBrowserIssues);
  },
  methods: {
    closeDialog,
    getBrowserIssues,
  },
};
