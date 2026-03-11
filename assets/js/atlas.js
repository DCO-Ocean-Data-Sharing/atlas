function Atlas(){
    // Boilerplate to create the map
    var map = L.map('map').setView([35, 0], 2);
        
    // Remove the 'Leaflet' attribution prefix
    map.attributionControl.setPrefix(false)
    
    // Load the GEBCO baselayer - by default we'll open the map with this baselayer'
    var gebco = L.tileLayer.wms('https://wms.gebco.net/mapserv?', {layers: 'GEBCO_LATEST', maxZoom: 19, attribution: 'Imagery reproduced from the <a href="http://www.doi.org/10.5285/1c44ce99-0a0d-5f4f-e063-7086abc0ea0f">GEBCO_2024 Grid, GEBCO Compilation Group (2024)</a>'}).addTo(map);
    
    // Load an OpenStreetMap baselayer
    var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', maxZoom: 19});
    
    // Load an Esri Grey Canvas baselayer
    var egc = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ', maxZoom: 16});
    
    // Load the Protected Seas Navigator Data from the Esri Feature Server
    var psnesri = L.esri.featureLayer({
        url: "https://services9.arcgis.com/lm7wE8a9YA9rKfzy/arcgis/rest/services/Navigator_AllSites_010925_attributes/FeatureServer/0",style: function () {return { color: "#70ca49", weight: 2 };}, attribution: 'ProtectedSeas'})
    
    var psnesriwms = L.esri.dynamicMapLayer({
        url: "https://services9.arcgis.com/lm7wE8a9YA9rKfzy/arcgis/rest/services/Navigator_AllSites_010925_attributes/MapServer/0", attribution: 'ProtectedSeas'});
    
    // Load the Decade Capacity Development Layer
    var capdev = L.geoJSON(capacitydevelopment, {
        pointToLayer: function (feature, latlng){
            return L.circleMarker(latlng, {
                radius: feature.properties.TotalParticipants,
                fillColor: "#ff7800",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });},
        onEachFeature: function (feature, layer){
            if (feature.properties && feature.properties.Country && feature.properties.TotalParticipants){
                layer.bindPopup(`<b>Country:</b> ${feature.properties.Country}<br/><br/><b>Total participants in<br/>capacity development<br/>organised by the UN<br/>Ocean Decade:</b> ${feature.properties.TotalParticipants}`);
            }
        }});
    
    // Load the National Oceanographic Data Centres Layer
    var markerColourFrog = new L.Icon({
        iconUrl: './assets/img/png/marker-colour-frog.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]});
    
    
    var nodcs = L.geoJSON(data_centres, {
        pointToLayer: function (feature, latlng){
            return L.marker(latlng, {
                attribution: 'Intergovernmental Oceanographic Commission (IOC) of UNESCO',
                icon: markerColourFrog});},
        onEachFeature: function (feature, layer){
            if (feature.properties && feature.properties.country && feature.properties.organisationName && feature.properties.website)
            layer.bindPopup(`<b>Country:</b> ${feature.properties.country}<br/><br/><b>Organisation Name:</b> ${feature.properties.organisationName}<br/><br/><b>Website:</b> <a href="${feature.properties.website}" target="_blank">Link</a><span class="material-icons" font-size="x-small">open_in_new</span>`);
        }
    });
    
    // Create the layer control
    var basetree = {
        label: 'Base layers',
        children: [
                {label: 'General Bathymetric Chart of the Ocean', layer: gebco},
                {label: 'OpenStreetMap', layer: osm},
                {label: 'Grey Canvas by Esri', layer: egc}
        ]};

    var datalayers = {
        label: 'Map layers',
        selectAllCheckbox: false,
        children: [
            {
                label: 'Conservation',
                selectAllCheckbox: true,
                children: [
                    {label: 'Protected Seas Navigator', layer: psnesri}
                ]
            },
            {
                label: 'Digital Representation of the Ocean',
                selectAllCheckbox: true,
                children: [
                    {label: 'National Oceanographic Data Centres', layer: nodcs}
                ]
            },
            {
                label: 'Capacity Development and Ocean Literacy for all',
                selectAllCheckbox: true,
                children: [
                    {label: 'Participants in training courses', layer: capdev}
                ]
            }
        ]};
    // Add the controls to the map
    L.control.layers.tree(basetree, datalayers, {}).addTo(map);
    }