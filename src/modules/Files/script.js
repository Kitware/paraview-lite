import { mapGetters, mapActions } from 'vuex';
import { Getters, Actions, Mutations } from 'paraview-lite/src/stores/types';

import module from './module';

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------

export default {
  name: 'Files',
  data() {
    return {
      label: 'Home',
      directories: [],
      groups: [],
      files: [],
      path: [],
      module,
      color: 'grey darken-2',
    };
  },
  computed: mapGetters({
    client: Getters.PVL_NETWORK_CLIENT,
  }),
  methods: Object.assign(
    {
      listServerDirectory(pathToList) {
        this.client.remote.FileListing.listServerDirectory(pathToList)
          .then((listing) => {
            const { dirs, files, groups, path } = listing;
            this.files = files;
            this.groups = groups;
            this.directories = dirs;
            this.path = path;
            this.label = this.path.slice(-1)[0];
          })
          .catch(console.error);
      },
      openFiles(files) {
        const pathPrefix = this.path.slice(1).join('/');
        const relativePathFiles =
          this.path.length > 1 ? files.map((f) => `${pathPrefix}/${f}`) : files;
        this.client.remote.ProxyManager.open(relativePathFiles)
          .then((readerProxy) => {
            this.$store.dispatch(Actions.PVL_PROXY_NAME_FETCH, readerProxy.id);
            this.$store.dispatch(Actions.PVL_PROXY_PIPELINE_FETCH);
            this.$store.dispatch(Actions.PVL_MODULES_ACTIVE_CLEAR);
            this.$store.commit(Mutations.PVL_PROXY_SELECTED_IDS_SET, [
              readerProxy.id,
            ]);
          })
          .catch(console.error);
      },
      openDirectory(directoryName) {
        this.listServerDirectory(this.path.concat(directoryName).join('/'));
      },
      listParentDirectory(index) {
        if (index) {
          this.listServerDirectory(this.path.slice(0, index + 1).join('/'));
        } else {
          this.listServerDirectory('.');
        }
      },
    },
    mapActions({ removeActiveModule: Actions.PVL_MODULES_ACTIVE_CLEAR })
  ),
  mounted() {
    this.listServerDirectory('.');
  },
};
