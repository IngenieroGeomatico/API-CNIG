const backgroundlayersOpts=[{id:"mapa",title:"Callejero",layers:["QUICK*Base_IGNBaseTodo_TMS"]},{id:"imagen",title:"Imagen",layers:["QUICK*BASE_PNOA_MA_TMS"]},{id:"hibrido",title:"H&iacute;brido",layers:["QUICK*BASE_PNOA_MA_TMS","QUICK*BASE_IGNBaseOrto_TMS"]}],params=window.location.search.split("&");let center="",zoom="",srs="",layers="";params.forEach((o=>{if(o.indexOf("center")>-1){const l=o.split("=")[1].split(",");center=[parseFloat(l[0]),parseFloat(l[1])]}else if(o.indexOf("zoom")>-1){const l=o.split("=")[1];zoom=parseInt(l,10)}else if(o.indexOf("srs")>-1){const l=o.split("=")[1];srs=l}else if(o.indexOf("layers")>-1){const l=o.substring(o.indexOf("=")+1,o.length);layers=l.split(",")}})),function(o){o.config("MOBILE_WIDTH","768"),o.config("MAPEA_URL","https://componentes.cnig.es/api-core/"),o.config("PROXY_URL",`${"file"!==location.protocol&&"file:"!==location.protocol?location.protocol:"https:"}\//componentes.cnig.es/api-core/api/proxy`),o.config("PROXY_POST_URL",`${"file"!==location.protocol&&"file:"!==location.protocol?location.protocol:"https:"}\//componentes.cnig.es/api-core/proxyPost`),o.config("TEMPLATES_PATH","/files/templates/"),o.config("THEME_URL",`${"file"!==location.protocol&&"file:"!==location.protocol?location.protocol:"https:"}\//componentes.cnig.es/api-core/assets/`),o.config("tileMappgins",{tiledNames:"${tile.mappings.tiledNames}".split(","),tiledUrls:"${tile.mappings.tiledUrls}".split(","),names:"${tile.mappings.names}".split(","),urls:"${tile.mappings.urls}".split(",")}),o.config("DEFAULT_PROJ","EPSG:3857*m"),o.config("tms",{base:"QUICK*Base_IGNBaseTodo_TMS"}),o.config("controls",{default:""}),o.config("backgroundlayers",backgroundlayersOpts),o.config("SQL_WASM_URL",`${"file"!==location.protocol&&"file:"!==location.protocol?location.protocol:"https:"}\//componentes.cnig.es/api-core/wasm/`),o.config("MAP_VIEWER_CENTER",center),o.config("MAP_VIEWER_ZOOM",zoom),o.config("MAP_VIEWER_SRS",srs),o.config("MAP_VIEWER_LAYERS",layers),o.config("MOVE_MAP_EXTRACT",!0)}(window.M);