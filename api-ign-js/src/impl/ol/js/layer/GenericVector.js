/**
 * @module M/impl/layer/GenericVector
 */
import * as LayerType from 'M/layer/Type';
import * as EventType from 'M/event/eventtype';
import { compileSync as compileTemplate } from 'M/util/Template';
import Popup from 'M/Popup';
import {
  isNullOrEmpty,
  isNull,
  getResolutionFromScale,
  isUndefined,
} from 'M/util/Utils';
import geojsonPopupTemplate from 'templates/geojson_popup';
import Vector from './Vector';
import ImplMap from '../Map';
import Feature from '../feature/Feature';

/**
 * @classdesc
 * Generic permite añadir cualquier tipo de capa definida con la librería base.
 * @property {Object} options - Opciones de la capa
 * @property {Number} zIndex_ - Índice de la capa
 * @property {String} sldBody - Cuerpo del SLD
 * @property {String} styles - Estilos de la capa
 * @property {String} style - Estilo de la capa
 * @property {String} cql - CQL de la capa
 * @property {Function} fnAddFeatures_ - Función para añadir features
 * @param {Object} options - Objeto de opciones
 * @param {Object} vendorOptions - Objeto de opciones del proveedor
 * @api
 * @extends {M.impl.layer.Vector}
 */
class GenericVector extends Vector {
  constructor(options = {}, vendorOptions) {
    // calls the super constructor
    super(options, vendorOptions);
    this.options = options;

    /**
     * Layer map. La instancia del mapa.
     */
    this.map = null;

    /**
     * WMS zIndex_. Índice de la capa, (+40).
     */
    this.zIndex_ = ImplMap.Z_INDEX[LayerType.GenericVector];


    this.sldBody = options.sldBody;

    /**
     * WMS styles. Estilos de la capa.
     */
    this.styles = this.options.styles || '';

    this.style = vendorOptions.getStyle === undefined ? null : vendorOptions.getStyle().name;

    if (this.style !== 'createDefaultStyle' && vendorOptions.getStyle) {
      this.style = vendorOptions.getStyle();
    }

    /**
     * WFS cql: Opcional: instrucción CQL para filtrar.
     * El método setCQL(cadena_cql) refresca la capa aplicando el
     * nuevo predicado CQL que recibe.
     */
    this.cql = this.options.cql;

    this.fnAddFeatures_ = null;

    this.ol3Layer = vendorOptions;
    this.maxExtent = options.userMaxExtent || [];
    this.ids = options.ids;
    this.version = options.version;
    this.legend = options.legend;
  }

  /**
   * Este método agrega la capa al mapa.
   *
   * @public
   * @function
   * @param {M.impl.Map} map Mapa de la implementación.
   * @api stable
   */
  addTo(map) {
    this.map = map;

    this.facadeVector_ = this.facadeLayer_;

    if (!isNullOrEmpty(this.visibility)) {
      this.ol3Layer.setVisible(this.visibility);
    }

    if (!isNullOrEmpty(this.maxZoom)) {
      this.ol3Layer.setMaxZoom(this.maxZoom);
    }

    if (!isNullOrEmpty(this.minZoom)) {
      this.ol3Layer.setMinZoom(this.minZoom);
    }

    if (!isNullOrEmpty(this.zIndex_)) {
      this.ol3Layer.setZIndex(this.zIndex_);
    }

    if (!isNullOrEmpty(this.maxExtent)) {
      this.ol3Layer.setExtent(this.maxExtent);
    }

    if (!isUndefined(this.ol3Layer.getSource().getLegendUrl)) {
      this.legendUrl_ = this.ol3Layer.getSource().getLegendUrl();
    }
    this.ol3Layer.setOpacity(this.opacity_);
    this.ol3Layer.setVisible(this.visibility);

    if (!isNullOrEmpty(this.ids)) {
      const featureId = this.ids.split(',').map((id) => {
        return this.name.concat('.').concat(id);
      });
      this.ol3Layer.getSource().setUrl(`${this.ol3Layer.getSource().getUrl()}&featureId=${featureId}`);
    }

    if (!isNullOrEmpty(this.cql)) {
      this.ol3Layer.getSource().setUrl(`${this.ol3Layer.getSource().getUrl()}&CQL_FILTER=${window.encodeURIComponent(this.cql)}`);
    }

    // calculates the resolutions from scales
    if (!isNull(this.options) &&
      !isNull(this.options.minScale) && !isNull(this.options.maxScale)) {
      const units = this.map.getProjection().units;
      this.options.minResolution = getResolutionFromScale(this.options.minScale, units);
      this.options.maxResolution = getResolutionFromScale(this.options.maxScale, units);
      this.ol3Layer.setMaxResolution(this.options.maxResolution);
      this.ol3Layer.setMinResolution(this.options.minResolution);
    } else if (!isNull(this.options) &&
      !isNull(this.options.minResolution) && !isNull(this.options.maxResolution)) {
      this.ol3Layer.setMaxResolution(this.options.maxResolution);
      this.ol3Layer.setMinResolution(this.options.minResolution);
    }

    map.getMapImpl().addLayer(this.ol3Layer);
    this.fnAddFeatures_ = this.addFeaturesToFacade.bind(this);
    this.ol3Layer.getSource().on('change', this.fnAddFeatures_);
  }

  addFeaturesToFacade() {
    if (this.ol3Layer.getSource().getState() === 'ready') {
      if (this.ol3Layer.getSource().getFeatures) {
        const features = this.ol3Layer.getSource().getFeatures().map((f) => {
          return Feature.olFeature2Facade(f);
        });
        this.loaded_ = true;
        this.facadeLayer_.addFeatures(features);
        this.deactivate();
        this.fire(EventType.LOAD, [this.features_]);
        if (this.style !== 'createDefaultStyle') {
          this.ol3Layer.setStyle(this.style);
        }
      } else {
        this.deactivate();
      }
    }
  }

  /**
   * Este método vuelve a dibujar la capa.
   *
   * @function
   * @public
   * @api stable
   */
  redraw() {
    const olLayer = this.getOL3Layer();
    if (!isNullOrEmpty(olLayer)) {
      const olSource = olLayer.getSource();
      /**  if (olSource instanceof OLSourceCluster) {
         olSource = olSource.getSource();
       } */
      // remove all features from ol vector
      const olFeatures = [...olSource.getFeatures()];
      olFeatures.forEach(olSource.removeFeature, olSource);

      const features = this.facadeLayer_.getFeatures();
      olSource.addFeatures(features.map(Feature.facade2OLFeature));
    }
  }


  /**
   * Este método desactiva el evento change de la capa.
   * @function
   * @api stable
   */
  deactivate() {
    this.ol3Layer.getSource().un('change', this.fnAddFeatures_);
    this.fnAddFeatures_ = null;
  }

  /**
   * Este método selecciona un objeto geográfico.
   * @public
   * @function
   * @param {ol.Feature} feature Objeto geográfico de Openlayers.
   * @api stable
   */
  selectFeatures(features, coord, evt) {
    const feature = features[0];
    if (this.extract === true) {
      this.unselectFeatures();
      if (!isNullOrEmpty(feature)) {
        const htmlAsText = compileTemplate(geojsonPopupTemplate, {
          vars: this.parseFeaturesForTemplate_(features),
          parseToHtml: false,
        });

        const featureTabOpts = {
          icon: 'g-cartografia-pin',
          title: this.name,
          content: htmlAsText,
        };

        let popup = this.map.getPopup();
        if (isNullOrEmpty(popup)) {
          popup = new Popup();
          popup.addTab(featureTabOpts);
          this.map.addPopup(popup, coord);
        } else {
          popup.addTab(featureTabOpts);
        }
      }
    }
  }

  /**
   * Este método modifica la URL del servicio.
   *
   * @function
   * @param {String} URL del servicio.
   * @api
   */
  setURLService(url) {
    if (!isNullOrEmpty(this.ol3Layer) && !isNullOrEmpty(this.ol3Layer.getSource) &&
        !isNullOrEmpty(this.ol3Layer.getSource()) && !isNullOrEmpty(url)) {
      this.ol3Layer.getSource().setUrl(url);
    }
  }

  /**
   * Este método obtiene la URL del servicio.
   *
   * @function
   * @returns {String} URL del servicio
   * @api
   */
  getURLService() {
    let url = '';
    if (!isNullOrEmpty(this.ol3Layer) && !isNullOrEmpty(this.ol3Layer.getSource) &&
        !isNullOrEmpty(this.ol3Layer.getSource())) {
      const source = this.ol3Layer.getSource();
      if (!isNullOrEmpty(source.getUrl)) {
        url = this.ol3Layer.getSource().getUrl();
      } else if (!isNullOrEmpty(source.getUrls)) {
        url = this.ol3Layer.getSource().getUrls();
      }
    }
    return url;
  }

  /**
   * Este método establece la clase de la fachada
   * de MBTiles.
   *
   * @function
   * @param {Object} obj Objeto a establecer como fachada.
   * @public
   * @api
   */
  setFacadeObj(obj) {
    this.facadeLayer_ = obj;
  }

  /**
   * Este método obtiene la resolución máxima para
   * este WMS.
   *
   *
   * @public
   * @function
   * @return {Number} Resolución Máxima.
   * @api stable
   */
  getMaxResolution() {
    return this.ol3Layer.getMaxResolution();
  }

  /**
   * Este método obtiene la resolución mínima.
   *
   * @public
   * @function
   * @return {Number} Resolución mínima.
   * @api stable
   */
  getMinResolution() {
    return this.ol3Layer.getMinResolution();
  }

  /**
   * Este método actualiza la capa.
   * @function
   * @api stable
   */
  refresh() {
    this.ol3Layer.getSource().refresh();
  }

  /**
   * Devuelve la URL de la leyenda.
   *
   * @public
   * @function
   * @returns {String} URL de la leyenda.
   * @api stable
   */
  getLegendURL() {
    return this.legendUrl_;
  }

  /**
   * Establece la URL de la leyenda.
   * @function
   * @param {String} newLegend URL de la leyenda.
   * @api stable
   */
  setLegendURL(newLegend) {
    if (!isNullOrEmpty(newLegend)) {
      this.legendUrl_ = newLegend;
    }
  }

  /**
   * Devuelve la extensión máxima de la capa.
   * @function
   * @returns {Array<Number>} Extensión máxima.
   * @api stable
   */
  getMaxExtent() {
    return this.ol3Layer.getSource().getExtent();
  }

  /**
   * Establece la extensión máxima de la capa.
   * @function
   * @param {Array<Number>} extent Extensión máxima.
   * @api stable
   */
  setMaxExtent(extent) {
    return this.ol3Layer.setExtent(extent);
  }

  /**
   * Este método establece la versión de la capa.
   * @function
   * @param {String} newVersion Nueva versión de la capa.
   * @api stable
   */
  setVersion(newVersion) {
    this.version = newVersion;
    this.ol3Layer.getSource().updateParams({ VERSION: newVersion });
  }

  getLayerType() {
    return this.ol3Layer.constructor.name;
  }

  /**
   * Este método destruye esta capa, limpiando el HTML
   * y anulando el registro de todos los eventos.
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    const olMap = this.map.getMapImpl();
    if (!isNullOrEmpty(this.ol3Layer)) {
      olMap.removeLayer(this.ol3Layer);
    }
    this.map = null;
  }


  getFormatType() {
    return this.ol3Layer.getSource().getFormat().constructor.name;
  }

  /**
   * Este método comprueba si son iguales dos capas.
   * @function
   * @param {M.layer.WFS} obj - Objeto a comparar.
   * @returns {boolean} Son iguales o no.
   * @api stable
   */
  equals(obj) {
    let equals = false;
    if (obj instanceof GenericVector) {
      equals = (this.url === obj.url);
      equals = equals && (this.name === obj.name);
      equals = equals && (this.version === obj.version);
    }

    return equals;
  }
}

export default GenericVector;