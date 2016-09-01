// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

function makeMap() {
  // initialize the map on the "map" div with a given center and zoom
  L.mapbox.accessToken = $('body').data('mapboxToken');
  var map = L.mapbox.map('map', 'mapbox.streets')
    .setView([39.045753, -76.641273], 9);

  var featureLayer = L.mapbox.featureLayer()
    .loadURL('/map/map_data.json')
    .addTo(map);

  var popup = new L.Popup({ autoPan: false  });
  var closeTooltip;
  var zoomToFeature = function(e) {
    map.fitBounds(e.target.getBounds());
  }
  var mousemove = function(e) {
    var layer = e.target;

    popup.setLatLng(e.latlng);
    popup.setContent(
      '<div class="marker-title">Zipcode: ' +
      layer.feature.properties.zipcode + '</div>' +
      'Median value: $' + layer.feature.properties.median_value);

    if (!popup._map) popup.openOn(map);
    window.clearTimeout(closeTooltip);

    // highlight feature
    layer.setStyle({
      weight: 3,
      opacity: 0.3,
      fillOpacity: 0.9
    });

    if (!L.Browser.ie && !L.Browser.opera) {
      layer.bringToFront();
    }
  }
  var mouseout = function(e) {
    var layer = e.target;
    layer.setStyle(getStyle(layer.feature));
    closeTooltip = window.setTimeout(function() {
      map.closePopup();
    }, 100);
  }

  var getStyle = function(feature) {
    return {
      weight: 2,
      opacity: 0.1,
      color: 'black',
      fillOpacity: 0.7,
      fillColor: getColor(feature.properties.median_value)
    };
  }
  var getColor = function(value) {
    return value > 750000 ? "#8c2d04" :
           value > 500000 ? "#cc4c02" :
           value > 400000 ? "#ec7014" :
           value > 300000 ? "#fe9929" :
           value > 200000 ? "#fec44f" :
           value > 100000 ? "#fee391" :
           value >  50000 ? "#fff7bc" :
                            "#ffffe5"
  };

  function getLegendHTML() {
    var grades = [0, 50000, 100000, 200000, 300000, 400000, 500000, 750000],
    labels = [],
    from, to;

    for (var i = 0; i < grades.length; i++) {
      from = grades[i];
      to = grades[i + 1];

      labels.push(
        '<li><span class="swatch" style="background:' + getColor(from + 1) + '"></span> ' +
        '$' + from + (to ? '&ndash;$' + to : '+')) + '</li>';
    }

    return '<span>Median Value</span><ul>' + labels.join('') + '</ul>';
  }

  // featureLayer.getBounds() returns the corners of the furthest-out markers,
  // and map.fitBounds() makes sure that the map contains these.
  featureLayer.on('ready', function(e) {
    featureLayer.eachLayer(function(layer) {
      var medianValue = layer.feature.properties.median_value;
      layer.on({
        mousemove: mousemove,
        mouseout: mouseout,
        click: zoomToFeature
      });
      layer.setStyle(getStyle(layer.feature));
    });
    map.legendControl.addLegend(getLegendHTML());
    map.fitBounds(featureLayer.getBounds());
  });
}
