import Images from 'paraview-lite/src/samples/images';

const version =
  window.GLANCE_VERSION && window.GLANCE_VERSION !== 'master'
    ? `v${window.GLANCE_VERSION}`
    : 'master';

// prettier-ignore
export default [
  {
    label: '202-t + Edges',
    image: Images.CAD,
    size: '112 KB',
    description: 'T-Handle, Flanged Base, Solid Bar',
    acknowledgement: 'https://www.traceparts.com/',
    datasets: [
      {
        name: '202-t.glance',
        url: `https://raw.githubusercontent.com/Kitware/paraview-glance/${version}/data/202-t.glance`,
      },
    ],
  },
  {
    label: 'Lysozyme.pdb',
    image: Images.Lysozyme,
    size: '135 KB',
    description: 'an enzyme that catalyzes the destruction of the cell walls of certain bacteria, occurring notably in tears and egg white.',
    datasets: [
      {
        name: 'Lysozyme.glance',
        url: `https://raw.githubusercontent.com/Kitware/paraview-glance/${version}/data/lysozyme.glance`,
      },
    ],
  },
  {
    label: 'Tooth.nrrd',
    image: Images.Tooth,
    size: '1.6 MB',
    datasets: [
      {
        name: 'Tooth.glance',
        url: `https://raw.githubusercontent.com/Kitware/paraview-glance/${version}/data/Tooth.glance`,
      },
    ],
  },
];
