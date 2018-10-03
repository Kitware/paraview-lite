function side(value) {
  if (value % 200 < 100) {
    return 'left';
  }
  return 'right';
}

function width(value) {
  const clampedValue = value % 200;
  if (clampedValue > 100) {
    return 200 - clampedValue;
  }
  return clampedValue;
}

export default {
  name: 'ProgressBar',
  props: {
    progress: {
      type: Number,
      default: 0,
    },
    color: {
      type: String,
      default: '#1E88E5',
    },
  },
  data() {
    return {
      lastStyle: '',
    };
  },
  computed: {
    style() {
      if (this.progress > 1) {
        this.lastStyle = `background: ${this.color}; ${side(
          this.progress
        )}: 0;`;
        return `${this.lastStyle} width: ${width(this.progress)}%;`;
      }
      return `opacity: 0; width: 0; ${this.lastStyle}`;
    },
  },
};
