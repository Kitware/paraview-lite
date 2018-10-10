import { Mutations } from 'paraview-lite/src/stores/types';

import Sources from 'paraview-lite/src/modules/Sources';
import sourcesModule from 'paraview-lite/src/modules/Sources/module';

import Files from 'paraview-lite/src/modules/Files';
import filesModule from 'paraview-lite/src/modules/Files/module';

import Sphere from 'paraview-lite/src/modules/Sphere';
import sphereModule from 'paraview-lite/src/modules/Sphere/module';

import Cone from 'paraview-lite/src/modules/Cone';
import coneModule from 'paraview-lite/src/modules/Cone/module';

import Clip from 'paraview-lite/src/modules/Clip';
import clipModule from 'paraview-lite/src/modules/Clip/module';

import Slice from 'paraview-lite/src/modules/Slice';
import sliceModule from 'paraview-lite/src/modules/Slice/module';

import Contour from 'paraview-lite/src/modules/Contour';
import contourModule from 'paraview-lite/src/modules/Contour/module';

import StreamTracer from 'paraview-lite/src/modules/StreamTracer';
import streamTracerModule from 'paraview-lite/src/modules/StreamTracer/module';

import Threshold from 'paraview-lite/src/modules/Threshold';
import thresholdModule from 'paraview-lite/src/modules/Threshold/module';

import DefaultComponent from 'paraview-lite/src/modules/Default';
import defaultModule from 'paraview-lite/src/modules/Default/module';

export default function registerModules(store) {
  // --------------------------------------------------------------------------
  // Widget registering
  // --------------------------------------------------------------------------

  store.commit(
    Mutations.MODULES_ADD,
    Object.assign({}, sourcesModule, { component: Sources })
  );
  store.commit(
    Mutations.MODULES_ADD,
    Object.assign({}, filesModule, { component: Files })
  );
  store.commit(
    Mutations.MODULES_ADD,
    Object.assign({}, sphereModule, { component: Sphere })
  );
  store.commit(
    Mutations.MODULES_ADD,
    Object.assign({}, coneModule, { component: Cone })
  );
  store.commit(
    Mutations.MODULES_ADD,
    Object.assign({}, clipModule, { component: Clip })
  );
  store.commit(
    Mutations.MODULES_ADD,
    Object.assign({}, sliceModule, { component: Slice })
  );
  store.commit(
    Mutations.MODULES_ADD,
    Object.assign({}, contourModule, { component: Contour })
  );
  store.commit(
    Mutations.MODULES_ADD,
    Object.assign({}, thresholdModule, { component: Threshold })
  );
  store.commit(
    Mutations.MODULES_ADD,
    Object.assign({}, streamTracerModule, { component: StreamTracer })
  );

  // --------------------------------------------------------------------------
  // Proxy to UI mapping
  // --------------------------------------------------------------------------

  store.commit(Mutations.PROXY_MODULE_BIND, {
    name: 'SphereSource',
    module: 'Sphere',
  });

  store.commit(Mutations.PROXY_MODULE_BIND, {
    name: 'ConeSource',
    module: 'Cone',
  });

  store.commit(Mutations.PROXY_MODULE_BIND, {
    name: 'Clip',
    module: 'Clip',
  });

  store.commit(Mutations.PROXY_MODULE_BIND, {
    name: 'Cut',
    module: 'Slice',
  });
  store.commit(Mutations.PROXY_MODULE_BIND, {
    name: 'Contour',
    module: 'Contour',
  });
  store.commit(Mutations.PROXY_MODULE_BIND, {
    name: 'Threshold',
    module: 'Threshold',
  });
  store.commit(Mutations.PROXY_MODULE_BIND, {
    name: 'StreamTracer',
    module: 'StreamTracer',
  });

  // --------------------------------------------------------------------------
  // Fallback mapping
  // --------------------------------------------------------------------------

  store.commit(
    Mutations.MODULES_ADD,
    Object.assign({}, defaultModule, {
      component: DefaultComponent,
      name: 'default',
    })
  );

  // --------------------------------------------------------------------------

  store.commit(Mutations.PROXY_MODULE_BIND, {
    name: 'default',
    module: 'default',
  });
}
