// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------

export default {
  name: 'CollapsableItem',
  props: {
    icon: {
      type: String,
      default: 'build',
    },
    small: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      collapsed: this.small,
    };
  },
  methods: {
    toggle() {
      this.collapsed = !this.collapsed;
    },
    open() {
      this.collapsed = false;
    },
    collapse() {
      this.collapsed = true;
    },
  },
};
