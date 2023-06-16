/**
 * IGN API
 * Version ${pom.version}
 * Date ${build.timestamp}
 */


const backgroundlayersOpts = [{
    id: 'mapa',
    title: 'Callejero',
    layers: [
      'TMS*IGNBaseTodo*https://tms-ign-base.idee.es/1.0.0/IGNBaseTodo/{z}/{x}/{-y}.jpeg*true*false*17',
    ],
  },
  {
    id: 'imagen',
    title: 'Imagen',
    layers: [
      'TMS*PNOA-MA*https://tms-pnoa-ma.idee.es/1.0.0/pnoa-ma/{z}/{x}/{-y}.jpeg*true*false*19',
    ],
  },
  {
    id: 'hibrido',
    title: 'H&iacute;brido',
    layers: [
      'TMS*PNOA-MA*https://tms-pnoa-ma.idee.es/1.0.0/pnoa-ma/{z}/{x}/{-y}.jpeg*true*false*19',
      'TMS*IGNBaseOrto*https://tms-ign-base.idee.es/1.0.0/IGNBaseOrto/{z}/{x}/{-y}.png*true*false*17',
    ],
  },
];

const params = window.location.search.split('&');
let center = '';
let zoom = '';
let srs = '';
let layers = '';
params.forEach((param) => {
  if (param.indexOf('center') > -1) {
    const values = param.split('=')[1].split(',');
    center = [parseFloat(values[0]), parseFloat(values[1])];
  } else if (param.indexOf('zoom') > -1) {
    const value = param.split('=')[1];
    zoom = parseInt(value, 10);
  } else if (param.indexOf('srs') > -1) {
    const value = param.split('=')[1];
    srs = value;
  } else if (param.indexOf('layers') > -1) {
    const value = param.substring(param.indexOf('=') + 1, param.length);
    layers = value.split(',');
  }
});

(function(M) {
  /**
   * Pixels width for mobile devices
   *
   * @private
   * @type {Number}
   */
  M.config('MOBILE_WIDTH', '${mobile.width}');

  /**
   * The Mapea URL
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.config('MAPEA_URL', '${mapea.url}');

  /**
   * The path to the Mapea proxy to send
   * jsonp requests
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.config('PROXY_URL', `${(location.protocol !== 'file' && location.protocol !== 'file:') ? location.protocol : 'https:'}\${mapea.proxy.url}`);

  /**
   * The path to the Mapea proxy to send
   * jsonp requests
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.config('PROXY_POST_URL', `${(location.protocol !== 'file' && location.protocol !== 'file:') ? location.protocol : 'https:'}\${mapea.proxy_post.url}`);

  /**
   * The path to the Mapea templates
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.config('TEMPLATES_PATH', '${mapea.templates.path}');

  /**
   * The path to the Mapea theme
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.config('THEME_URL', `${(location.protocol !== 'file' && location.protocol !== 'file:') ? location.protocol : 'https:'}\${mapea.theme.url}`);

  /**
   * The path to the Mapea theme
   * @const
   * @type {string}
   * @public
   * @api stable
   */

  /**
   * TODO
   * @type {object}
   * @public
   * @api stable
   */
  M.config('tileMappgins', {
    /**
     * Predefined WMC URLs
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    tiledNames: '${tile.mappings.tiledNames}'.split(','),

    /**
     * WMC predefined names
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    tiledUrls: '${tile.mappings.tiledUrls}'.split(','),

    /**
     * WMC context names
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    names: '${tile.mappings.names}'.split(','),

    /**
     * WMC context names
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    urls: '${tile.mappings.urls}'.split(','),
  });

  /**
   * Default projection
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.config('DEFAULT_PROJ', '${mapea.proj.default}');

  /**
   * TMS configuration
   *
   * @private
   * @type {object}
   */
  M.config('tms', {
    base: '${tms.base}',
  });

  /**
   * Controls configuration
   *
   * @private
   * @type {object}
   */
  M.config('controls', {
    default: '${controls.default}',
  });

  /**
   * BackgroundLayers Control
   *
   * @private
   * @type {object}
   */
  M.config('backgroundlayers', backgroundlayersOpts);

  /**
   * URL of sql wasm file
   * @private
   * @type {String}
   */
  M.config('SQL_WASM_URL', `${(location.protocol !== 'file' && location.protocol !== 'file:') ? location.protocol : 'https:'}\${sql_wasm.url}`);

  /**
   * MAP Viewer - Center
   *
   * @private
   * @type {object}
   */
  M.config('MAP_VIEWER_CENTER', center);

  /**
   * MAP Viewer - Zoom
   *
   * @private
   * @type {object}
   */
  M.config('MAP_VIEWER_ZOOM', zoom);

  /**
   * MAP Viewer - SRS
   *
   * @private
   * @type {object}
   */
  M.config('MAP_VIEWER_SRS', srs);

  /**
   * MAP Viewer - Layers
   *
   * @private
   * @type {object}
   */
  M.config('MAP_VIEWER_LAYERS', layers);
}(window.M));
