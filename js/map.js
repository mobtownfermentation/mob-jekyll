//Map
$(document).ready(function(){

L.Map.mergeOptions({
    sleep: true,
    sleepTime: 750,
    wakeTime: 750,
    sleepNote: true,
    hoverToWake: true
});

L.Map.Sleep = L.Handler.extend({
    addHooks: function () {
        this.sleepNote = L.DomUtil.create('p', 'sleep-note', this._map._container);
        this._sleepMap();
        this._enterTimeout = null;
        this._exitTimeout = null;


        var noteString = 'Click ' + (this._map.options.hoverToWake ? 'or Hover ' : '') + 'to Wake',
            style = this.sleepNote.style;
        if (this._map.options.sleepNote) {
            this.sleepNote.appendChild(document.createTextNode(noteString));
            style['max-width'] = '150px';
            style.opacity = '.6';
            style.margin = 'auto';
            style['text-align'] = 'center';
            style['border-radius'] = '4px';
            style.top = '50%';
            style.position = 'relative';
            style.padding = '5px';
            style.border = 'solid 2px black';
            style.background = 'white';
        }
    },

    removeHooks: function () {
        if (!this._map.scrollWheelZoom.enabled()) {
            this._map.scrollWheelZoom.enable();
        }
        L.DomUtil.setOpacity(this._map._container, 1);
        L.DomUtil.setOpacity(this.sleepNote, 0);
        this._removeSleepingListeners();
        this._removeAwakeListeners();
    },

    _wakeMap: function () {
        this._stopWaiting();
        this._map.scrollWheelZoom.enable();
        L.DomUtil.setOpacity(this._map._container, 1);
        this.sleepNote.style.opacity = 0;
        this._addAwakeListeners();
    },

    _sleepMap: function () {
        this._stopWaiting();
        this._map.scrollWheelZoom.disable();
        L.DomUtil.setOpacity(this._map._container, .7);
        this.sleepNote.style.opacity = .4;
        this._addSleepingListeners();
    },

    _wakePending: function () {
        this._map.once('click', this._wakeMap, this);
        if (this._map.options.hoverToWake) {
            var self = this;
            this._map.once('mouseout', this._sleepMap, this);
            self._enterTimeout = setTimeout(function () {
                self._map.off('mouseout', self._sleepMap, self);
                self._wakeMap();
            }, self._map.options.wakeTime);
        }
    },

    _sleepPending: function () {
        var self = this;
        self._map.once('mouseover', self._wakeMap, self);
        self._exitTimeout = setTimeout(function () {
            self._map.off('mouseover', self._wakeMap, self);
            self._sleepMap();
        }, self._map.options.sleepTime);
    },

    _addSleepingListeners: function () {
        this._map.once('mouseover', this._wakePending, this);
    },

    _addAwakeListeners: function () {
        this._map.once('mouseout', this._sleepPending, this);
    },

    _removeSleepingListeners: function () {
        this._map.options.hoverToWake &&
          this._map.off('mouseover', this._wakePending, this);
        this._map.off('mousedown click', this._wakeMap, this);
    },

    _removeAwakeListeners: function () {
        this._map.off('mouseout', this._sleepPending, this);
    },

    _stopWaiting: function () {
        this._removeSleepingListeners();
        this._removeAwakeListeners();
        var self = this;
        if (this._enterTimeout) clearTimeout(self._enterTimeout);
        if (this._exitTimeout) clearTimeout(self._exitTimeout);
        this._enterTimeout = null;
        this._exitTimeout = null;
    }
});

L.Map.addInitHook('addHandler', 'sleep', L.Map.Sleep);

L.mapbox.accessToken = 'pk.eyJ1IjoibW9idG93bmZlcm1lbnRhdGlvbiIsImEiOiI2YmMyYTk1ZDkzZjczOTUzNzlkZTlhMjYxN2M2OTNjYiJ9.3KhCewawdUqhTLGwF0PmsQ';
var initExtent = [39.2918809, -76.6400553];
    southWest = L.latLng(38, -78),
    northEast = L.latLng(41, -75),
    bounds = L.latLngBounds(southWest, northEast);

var map = L.mapbox.map('map', 'mapbox.streets', {zoomControl: false,minZoom: 9,maxZoom: 26,maxBounds: bounds,sleep: true,sleepTime: 800,wakeTime: 500,sleepNote: false,hoverToWake: true});
new L.Control.Zoom({ position: 'topright' }).addTo(map);

var clusterGroup = new L.MarkerClusterGroup({
    iconCreateFunction: function (cluster) {
        var markers = cluster.getChildCount();
        return L.divIcon({html: markers, className: 'cluster', iconSize:L.point(35,35)})
    },
    maxClusterRadius:30,
    spiderfyOnMaxZoom:true
}).addTo(map);

var points = L.geoJson(locations);
var list = document.getElementById("locations");
points.eachLayer(function(loc){
  var li = document.createElement("li");
  var title = document.createElement("p");
  title.textContent = loc.feature.properties.title;
  var street = document.createElement("p");
  street.textContent = loc.feature.properties.street;
  var city = document.createElement("p");
  city.textContent = loc.feature.properties.city;
  var phone = document.createElement("p");
  phone.textContent = loc.feature.properties.phone;

  var pic = document.createElement("div");
  pic.className = "liPic";
  pic.style['background-image'] = "url('"+loc.feature.properties.pic+"')";
  li.appendChild(title);
  li.appendChild(street);
  li.appendChild(city);
  li.appendChild(phone);
  li.appendChild(pic);

  li.className = "cf";

  var marker = L.marker([loc.feature.geometry.coordinates[1],loc.feature.geometry.coordinates[0]])
    .setIcon(L.divIcon({
        className: "marker",
        iconSize:[35,35],
        popupAnchor:[0,-10]
    }))
    .bindPopup("<a href='"+loc.feature.properties.link+"' target='_blank'>"+loc.feature.properties.title+"</a>")
    .addTo(clusterGroup);

  li.addEventListener("click",function(){
    map.setView(loc.getLatLng(), 16);
    marker.openPopup();
  })

  list.appendChild(li);
});
map.fitBounds(points.getBounds());

$("#mapAll").on("click", function(){
  map.fitBounds(points.getBounds());
  map.closePopup();
});

});//pageReady
