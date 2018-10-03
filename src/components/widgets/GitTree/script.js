// Generic global methods -----------------------------------------------------

function sortById(a, b) {
  return Number(a.id) < Number(b.id);
}

function generateModel(list, rootId) {
  const model = {
    // Temporary structures
    tree: { [rootId]: [] },
    map: {},
    leaves: [],

    // Helper variables
    rootId,
    y: 0,

    // Results
    nodes: [],
    forks: [],
    branches: [],
    actives: [],
  };

  list.forEach((el) => {
    // Make sure we don't share the same reference
    // with the outside world.
    const node = Object.assign({}, el);

    // Register node as a child of its parent
    if (!{}.hasOwnProperty.call(model.tree, node.parent)) {
      model.tree[node.parent] = [node];
    } else {
      model.tree[node.parent].push(node);
    }

    // Register node to easily find it later by its 'id'
    model.map[node.id] = node;
  });

  // Sort the children of the root
  model.tree[rootId].sort(sortById);

  // All set for the processing
  return model;
}

/* eslint-disable no-param-reassign */
function assignNodePosition(model, node, x) {
  // Get children if any
  const children = model.tree[node.id];

  // Expand node with position information
  node.x = x;
  node.y = model.y;
  model.y += 1;

  // Register node in the list
  model.nodes.push(node);

  // Process children
  if (!children || children.length === 0) {
    // This node is a leaf, keep track of it for future processing
    model.leaves.push(node);
  } else {
    // Garanty unique branching order logic
    children.sort(sortById);

    // Move down the tree with the most right side of the tree
    children.forEach((child, index) => {
      assignNodePosition(model, child, x + children.length - (index + 1));
    });
  }
}

function extractBranchesAndForks(model, leaf) {
  const { x, y } = leaf;
  const { rootId, map, branches, forks } = model;
  const branch = { x, y };
  let currentNode = leaf;

  // Move currentNode to the top before fork while stretching the branch
  while (
    currentNode.parent !== rootId &&
    map[currentNode.parent].x === branch.x
  ) {
    currentNode = map[currentNode.parent];
    branch.to = currentNode.y;
  }

  // Do we really have a new branch?
  if (typeof branch.to !== 'undefined' && branch.to !== branch.y) {
    branches.push(branch);
  }

  // Do we have a fork?
  if (currentNode.parent !== rootId) {
    forks.push({
      x: map[currentNode.parent].x,
      y: map[currentNode.parent].y,
      toX: currentNode.x,
      toY: currentNode.y,
    });
  }
}

function fillActives(model, activeIds = []) {
  const { nodes, actives } = model;

  // Fill the actives list with the position instead of ids
  nodes.forEach((node) => {
    if (activeIds.indexOf(node.id) !== -1) {
      actives.push(node.y);
    }
  });
}

function processData(list, activeIds = [], rootIdRef = '0') {
  const model = generateModel(list, rootIdRef);
  const { tree, leaves, rootId } = model;
  const { nodes, branches, forks, actives } = model;

  // Assign each node position starting from the root
  tree[rootId].forEach((rootNode) => assignNodePosition(model, rootNode, 0));

  // Update active list
  fillActives(model, activeIds);

  // Create branches and forks starting from the leaves
  leaves.forEach((leaf) => extractBranchesAndForks(model, leaf));

  // Sort forks for better rendering
  forks.sort((a, b) => a.toX > b.toX);

  // Save computed structure to state
  return { nodes, branches, forks, actives, leaves };
}

// ----------------------------------------------------------------------------

export default {
  name: 'GitTree',
  props: {
    sources: {
      type: Array,
      default: () => [],
    },
    actives: {
      type: Array,
      default: () => [],
    },
    activeBackground: {
      type: String,
      default: '#757575',
    },
    deltaX: {
      type: Number,
      default: 20,
    },
    deltaY: {
      type: Number,
      default: 30,
    },
    fontSize: {
      type: Number,
      default: 16,
    },
    margin: {
      type: Number,
      default: 3,
    },
    multiselect: {
      type: Boolean,
      default: false,
    },
    offset: {
      type: Number,
      default: 15,
    },
    palette: {
      type: Array,
      default: () => ['#e1002a', '#417dc0', '#1d9a57', '#e9bc2f', '#9b3880'],
    },
    radius: {
      type: Number,
      default: 6,
    },
    rootId: {
      type: String,
      default: '0',
    },
    stroke: {
      type: Number,
      default: 3,
    },
    width: {
      type: Number,
      default: 500,
    },
    activeCircleStrokeColor: {
      type: String,
      default: 'black', // if 'null', the branch color will be used
    },
    notVisibleCircleFillColor: {
      type: String,
      default: 'white', // if 'null', the branch color will be used
    },
    textColor: {
      type: Array,
      default: () => ['black', 'white'], // Normal, Active
    },
    textWeight: {
      type: Array,
      default: () => ['normal', 'bold'], // Normal, Active
    },
  },
  data() {
    return {
      nodes: [],
      branches: [],
      forks: [],
      activesToRender: [],
    };
  },
  watch: {
    sources() {
      this.updateData(this.sources, this.actives);
    },
    actives() {
      this.updateData(this.sources, this.actives);
    },
  },
  computed: {
    branchesToRender() {
      return this.branches.map((branch, index) => {
        const x1 = this.deltaX * branch.x + this.offset;
        const y1 = this.deltaY * branch.y + this.deltaY / 2;
        const y2 = this.deltaY * branch.to + this.deltaY / 2;
        const strokeColor = this.palette[branch.x % this.palette.length];

        return {
          key: `branch-${index}`,
          d: `M${x1},${y1} L${x1},${y2}`,
          stroke: strokeColor,
        };
      });
    },
    forksToRender() {
      return this.forks.map((fork, index) => {
        const x1 = this.deltaX * fork.x + this.offset;
        const y1 = this.deltaY * fork.y + this.deltaY / 2 + this.radius;
        const x2 = this.deltaX * fork.toX + this.offset;
        const y2 = this.deltaY * fork.toY + this.deltaY / 2 + this.radius;
        const strokeColor = this.palette[fork.toX % this.palette.length];
        const dPath =
          `M${x1},${y1} ` +
          `Q${x1},${y1 + this.deltaY / 3},${(x1 + x2) / 2},${y1 +
            this.deltaY / 3} ` +
          `T${x2},${y1 + this.deltaY} L${x2},${y2}`;

        return {
          key: `fork-${index}`,
          d: dPath,
          stroke: strokeColor,
        };
      });
    },
    nodesToRender() {
      return this.nodes.map((node, index) => {
        const isActive = this.activesToRender.includes(index);
        const isVisible = !!node.visible;
        const branchColor = this.palette[node.x % this.palette.length];

        // Styles
        const currentTextColor = this.textColor[isActive ? 1 : 0];
        const weight = this.textWeight[isActive ? 1 : 0];
        const strokeColor = isActive
          ? this.activeCircleStrokeColor
          : branchColor || branchColor;
        const fillColor = isVisible
          ? branchColor
          : this.notVisibleCircleFillColor || branchColor;

        // Positions
        const cx = this.deltaX * node.x + this.offset;
        const cy = this.deltaY * node.y + this.deltaY / 2;
        const tx = cx + this.radius * 2;
        const ty = cy + (this.radius - 1);

        return {
          key: `node-${index}`,
          id: node.y,
          circle: {
            cx,
            cy,
            radius: this.radius,
            stroke: strokeColor,
            fill: fillColor,
          },
          text: {
            x: tx,
            y: ty,
            fill: currentTextColor,
            fontWeight: weight,
            fontSize: this.fontSize,
            content: node.name,
          },
        };
      });
    },
  },
  methods: {
    updateData(list, activeIds = []) {
      const { nodes, branches, forks, actives } = processData(
        list,
        activeIds,
        this.rootId
      );
      this.nodes = nodes;
      this.branches = branches;
      this.forks = forks;
      this.activesToRender = actives;
    },
    toggleActive(event) {
      const { actives, deltaY, multiselect, nodes } = this;
      const newActive = actives.slice();

      if (event.target.nodeName !== 'circle') {
        const size = this.$el.getClientRects()[0];

        // Firefox vs Chrome/Safari// Firefox vs Chrome/Safari
        const originTop = size.y || size.top;
        const yVal = Math.floor((event.clientY - originTop) / deltaY);
        const index = actives.indexOf(yVal);

        // command key for osx, control key for windows
        if (multiselect && (event.metaKey || event.ctrlKey)) {
          if (index === -1) {
            newActive.push(yVal);
          } else {
            newActive.splice(index, 1);
          }
          this.activesToRender = newActive.map((i) => nodes[i].id);
          this.$emit('git:actives', this.activesToRender);
        } else {
          newActive[0] = yVal;
          this.activesToRender = newActive.map((i) => nodes[i].id);
          this.$emit('git:actives', this.activesToRender);
        }
      }
    },
    toggleVisibility(event) {
      const yVal = parseInt(event.currentTarget.dataset.id, 10);
      const node = Object.assign({}, this.nodes[yVal]);

      node.visible = !node.visible;
      this.nodes = this.nodes.map((n, i) => (i === yVal ? node : n));

      this.$emit('git:visibility', { id: node.id, visible: node.visible });
    },
  },
};
