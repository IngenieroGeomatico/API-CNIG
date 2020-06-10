/**
 * @module M/plugin/Timeline
 */
import 'assets/css/timeline';
import TimelineControl from './timelinecontrol';
import api from '../../api';
import { getValue } from './i18n/language';
// import { isArray } from '../../../../../facade/js/util/Utils';

export default class Timeline extends M.Plugin {
  /**
   * @classdesc
   * Main facade plugin object. This class creates a plugin
   * object which has an implementation Object
   *
   * @constructor
   * @extends {M.Plugin}
   * @param {Object} impl implementation object
   * @api stable
   */
  constructor(options = {}) {
    super();

    /**
     * Name plugin
     * @private
     * @type {String}
     */
    this.name_ = 'timeline';

    /**
     * Facade of the map
     * @private
     * @type {M.Map}
     */
    this.map_ = null;

    /**
     * Array of controls
     * @private
     * @type {Array<M.Control>}
     */
    this.controls_ = [];

    /**
     * Class name of the html view Plugin
     * @public
     * @type {string}
     */
    this.className = 'm-plugin-timeline';

    /**
     * Position of the Plugin
     * @public
     * Posible values: TR | TL | BL | BR
     * @type {String}
     */
    const positions = ['TR', 'TL', 'BL', 'BR'];
    this.position = positions.includes(options.position) ? options.position : 'TR';

    /**
     * Intervals
     * @public
     * Value: Array with each interval attributes [name, tag, service]
     * @type {String}
     */
    if (options !== undefined) {
      if (M.utils.isString(options.intervals)) {
        this.intervals = JSON.parse(options.intervals.replace(/!!/g,'[').replace(/¡¡/g,']'));
      } else {
        this.intervals = options.intervals;
      }
    }

    /**
     * Metadata from api.json
     * @private
     * @type {Object}
     */
    this.metadata_ = api.metadata;

    this.separatorApiJson = api.url.separator;

    /**
     *@private
     *@type { string }
     */
    this.tooltip_ = options.tooltip || getValue('tooltip');
  }

  /**
   * This function adds this plugin into the map
   *
   * @public
   * @function
   * @param {M.Map} map the map to add the plugin
   * @api stable
   */
  addTo(map) {
    this.control_ = new TimelineControl(this.intervals);
    this.controls_.push(this.control_);
    this.map_ = map;
    this.panel_ = new M.ui.Panel('panelTimeline', {
      collapsible: true,
      position: M.ui.position[this.position],
      className: this.className,
      collapsedButtonClass: 'g-cartografia-timeline',
      tooltip: this.tooltip_,
    });
    this.panel_.addControls(this.controls_);
    map.addPanels(this.panel_);
  }


  /**
   * This function destroys this plugin
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    this.control_.removeTimelineLayers();
    this.map_.removeControls([this.control_]);
    [this.control_, this.panel_, this.map_, this.layers, this.radius] = [null, null, null, null, null];
  }

  /**
   * This function gets name plugin
   * @getter
   * @public
   * @returns {string}
   * @api stable
   */
  get name() {
    return this.name_;
  }

  /**
   * This function gets metadata plugin
   *
   * @public
   * @getter
   * @api stable
   * @return {Object}
   */
  getMetadata() {
    return this.metadata_;
  }

  /**
   * Get the API REST Parameters of the plugin
   *
   * @function
   * @public
   * @api
   */
  getAPIRest() {
    const intervals = JSON.stringify(this.intervals).replace(/\[/g,'!!').replace(/\]/g,'¡¡');
    return `${this.name}=${this.position}*!${intervals}`;
  }

  /**
   * Activate plugin
   *
   * @function
   * @public
   * @api
   */
  activate() {
    this.control_.activate();
  }

  /**
   * Desactivate plugin
   *
   * @function
   * @public
   * @api
   */
  deactivate() {
    this.control_.deactivate();
  }

  /**
   * This
   function compare
   if pluging recieved by param is instance of M.plugin.Timeline
   *
   * @public
   * @function
   * @param {M.plugin} plugin to compare
   * @api stable
   */
  equals(plugin) {
    if (plugin instanceof Timeline) {
      return true;
    }
    return false;
  }
}