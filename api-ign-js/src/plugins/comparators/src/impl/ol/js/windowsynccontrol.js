/**
 * @module M/impl/control/WindowSyncControl
 */
export default class WindowSyncControl extends M.impl.Control {
  /**
     * This function adds the control to the specified map
     *
     * @public
     * @function
     * @param {M.Map} map to add the plugin
     * @param {HTMLElement} html of the plugin
     * @api stable
     */
  addTo(map) {
    this.maps = [];
  }

  // ? API DONT EVENT ROTATE
  handleMoveMap(maps) {
    this.addEventListeners = this.addEventListeners.bind(this);
    maps.forEach(({ map }) => {
      const mapOl = map.getMapImpl();
      mapOl.on(['moveend', 'rotateend'], this.addEventListeners);
    });
  }


  removeEventListeners(maps) {
    maps.forEach(({ map }) => {
      const mapOl = map.getMapImpl();
      this.addEventListeners = this.addEventListeners.bind(this);
      mapOl.un('moveend', this.addEventListeners);
      mapOl.un('rotateend', this.addEventListeners);
    });
  }

  evtChangeMaps(map1Ol, map2) {
    const map2Ol = map2.getMapImpl();
    const view = map1Ol.getView();
    const center = view.getCenter();
    const zoom = view.getZoom();
    const rotation = view.getRotation();

    /*
    map2Ol.getView().setZoom(zoom);
    map2Ol.getView().setCenter(center);
    map2Ol.getView().setRotation(rotation);
    */


    map2Ol.getView().animate({
      center,
      zoom,
      rotation,
      duration: 100,
    });
  }

  addEventListeners(evt) {
    this.maps.forEach(({ map }) => {
      this.evtChangeMaps(evt.map, map);
    });
  }
}

