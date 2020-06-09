import Vectors from 'facade/vectors';

const map = M.map({
  container: 'mapjs',
  center: {
    x: -528863.345515127,
    y: 4514194.232367303,
  },
  zoom: 9,
  /*layers: [
    //'WMTS*http://www.ideandalucia.es/geowebcache/service/wmts?*toporaster*SIG-C:25830*WMTS*false',
    //'WFS*CampamentosCampamentosCampamentosCampamentos*http://geostematicos-sigc.juntadeandalucia.es/geoserver/sepim/ows*sepim:campamentos*POINT***eyJwYXJhbWV0ZXJzIjpbeyJpY29uIjp7ImZvcm0iOiJDSVJDTEUiLCJjbGFzcyI6ImctY2FydG9ncmFmaWEtYmFuZGVyYSIsImZvbnRzaXplIjowLjUsInJhZGl1cyI6MTUsImZpbGwiOiJ3aGl0ZSJ9LCJyYWRpdXMiOjV9XSwiZGVzZXJpYWxpemVkTWV0aG9kIjoiKChzZXJpYWxpemVkUGFyYW1ldGVycykgPT4gTS5zdHlsZS5TaW1wbGUuZGVzZXJpYWxpemUoc2VyaWFsaXplZFBhcmFtZXRlcnMsICdNLnN0eWxlLlBvaW50JykpIn0',
  ],*/
});

const mp = new Vectors({
  collapsed: true,
  collapsible: true,
  position: 'TR',
});

const provincias = new M.layer.WFS({
  url: "http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?",
  namespace: "tematicos",
  name: "Provincias",
  legend: "Provincias",
  geometry: 'MPOLYGON',
});

const viales = new M.layer.WFS({
  url: "http://g-gis-online-lab.desarrollo.guadaltel.es/geoserver/ggiscloud_root/wms?",
  namespace: "ggiscloud_root",
  name: "a1585302352391_viales_almeria",
  legend: "Viales",
  geometry: 'LINE',
});

//map.addWFS(provincias);
//map.addWFS(viales);
map.addPlugin(mp);
window.map = map;
