const map = M.map({
  container: 'map',
  controls: ['panzoom', 'scale*true', 'scaleline', 'rotate', 'location', 'getfeatureinfo'],
  zoom: 5,
  center: [-467062.8225, 4683459.6216],
  getfeatureinfo: true,
});

const mp = new M.plugin.IGNSearch({
  servicesToSearch: 'gn',
  maxResults: 10,
  isCollapsed: false,
  noProcess: 'municipio,poblacion',
  countryCode: 'es',
  reverse: true,
});
const mp2 = new M.plugin.Attributions({
  mode: 1,
  scale: 10000,
});
const mp3 = new M.plugin.ShareMap({
  baseUrl: 'https://api-ign-lite.desarrollo.guadaltel.es/api-core/',
  position: 'BR',
});
const mp4 = new M.plugin.XYLocator({
  position: 'TL',
});
const mp6 = new M.plugin.ZoomExtent();
const mp7 = new M.plugin.MouseSRS({
  projection: 'EPSG:4326',
});
const mp8 = new M.plugin.TOC({
  collapsed: false,
});

const mp9 = new M.plugin.BackImgLayer({
  position: 'TR',
  layerId: 0,
  layerVisibility: true,
  layerOpts: [{
      id: 'mapa',
      preview: '../../src/plugins/backimglayer/src/facade/assets/images/svqmapa.png',
      title: 'Mapa',
      layers: [new M.layer.WMTS({
        url: 'https://www.ign.es/wmts/ign-base?',
        name: 'IGNBaseTodo',
        legend: 'Mapa IGN',
        matrixSet: 'GoogleMapsCompatible',
      }, {
        format: 'image/jpeg',
      })],
    },
    {
      id: 'imagen',
      title: 'Imagen',
      preview: '../../src/plugins/backimglayer/src/facade/assets/images/svqimagen.png',
      layers: [new M.layer.WMTS({
        url: 'https://www.ign.es/wmts/pnoa-ma?',
        name: 'OI.OrthoimageCoverage',
        legend: 'Imagen (PNOA)',
        matrixSet: 'GoogleMapsCompatible',
      }, {
        format: 'image/png',
      })],
    },
    {
      id: 'hibrido',
      title: 'Híbrido',
      preview: '../../src/plugins/backimglayer/src/facade/assets/images/svqhibrid.png',
      layers: [new M.layer.WMTS({
        url: 'https://www.ign.es/wmts/pnoa-ma?',
        name: 'OI.OrthoimageCoverage',
        legend: 'Imagen (PNOA)',
        matrixSet: 'GoogleMapsCompatible',
      }, {
        format: 'image/png',
      }), new M.layer.WMTS({
        url: 'https://www.ign.es/wmts/ign-base?',
        name: 'IGNBaseOrto',
        matrixSet: 'GoogleMapsCompatible',
        legend: 'Mapa IGN',
      }, {
        format: 'image/png',
      })],
    },
    {
      id: 'lidar',
      preview: '../../src/plugins/backimglayer/src/facade/assets/images/svqlidar.png',
      title: 'LIDAR',
      layers: [new M.layer.WMTS({
        url: 'https://wmts-mapa-lidar.idee.es/lidar?',
        name: 'EL.GridCoverageDSM',
        legend: 'Modelo Digital de Superficies LiDAR',
        matrixSet: 'GoogleMapsCompatible',
      }, {
        format: 'image/png',
      })],
    },
  ],
});

map.addPlugin(mp);
map.addPlugin(mp2);
map.addPlugin(mp3);
map.addPlugin(mp4);
map.addPlugin(mp6);
map.addPlugin(mp7);
map.addPlugin(mp8);
map.addPlugin(mp9);

window.map = map;
