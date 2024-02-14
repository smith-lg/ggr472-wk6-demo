/*--------------------------------------------------------------------
GGR472 WEEK 6: JavaScript for Web Maps
MapData and MapMouse Events
--------------------------------------------------------------------*/


//Define access token
mapboxgl.accessToken = ''; //****ADD YOUR PUBLIC ACCESS TOKEN*****

//Initialize map
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/lgsmith/ckoyrp6z71apc17ph5d5zlcno',
    center: [-105, 58],
    zoom: 3,
    maxBounds: [
        [-180, 30], // Southwest
        [-25, 84]  // Northeast
    ],
});

//Add search control to map overlay
//Requires plugin as source in HTML body
map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        countries: "ca" //Try searching for places inside and outside of canada to test the geocoder
    })
);

//Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());



//Add data source and draw initial visiualization of layer
map.on('load', () => {

    //Use GeoJSON file as vector tile creates non-unique IDs for features which causes difficulty when highlighting polygons
    map.addSource('canada-provterr', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/smith-lg/ggr472-wk6-demo/main/data/can-provterr.geojson', //Link to raw github files when in development stage. Update to pages on deployment
        'generateId': true //Create a unique ID for each feature
    });

    //Add layer only once using case expression and feature state for opacity
    map.addLayer({
        'id': 'provterr-fill',
        'type': 'fill',
        'source': 'canada-provterr',
        'paint': {
            'fill-color': '#627BC1',
            'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                1,
                0.5
            ], //CASE and FEATURE STATE expression sets opactity as 0.5 when hover state is false and 1 when updated to true
            'fill-outline-color': 'white'
        },
       // remove source layer as it is not needed for geojson
    });

});



/*--------------------------------------------------------------------
SIMPLE CLICK EVENT
--------------------------------------------------------------------*/
map.on('click', 'provterr-fill', (e) => {

    //console.log(e);   //e is the event info triggered and is passed to the function as a parameter (e)
    //Explore console output using Google DevTools

    let provname = e.features[0].properties.PRENAME;
    console.log(provname);

});



/*--------------------------------------------------------------------
ADD POP-UP ON CLICK EVENT
--------------------------------------------------------------------*/
map.on('mouseenter', 'provterr-fill', () => {
    map.getCanvas().style.cursor = 'pointer'; //Switch cursor to pointer when mouse is over provterr-fill layer
});

map.on('mouseleave', 'provterr-fill', () => {
    map.getCanvas().style.cursor = ''; //Switch cursor back when mouse leaves provterr-fill layer
});


map.on('click', 'provterr-fill', (e) => {
    new mapboxgl.Popup() //Declare new popup object on each click
        .setLngLat(e.lngLat) //Use method to set coordinates of popup based on mouse click location
        .setHTML("<b>Province/Territory:</b> " + e.features[0].properties.PRENAME + "<br>" +
            "Population: " + e.features[0].properties.POP2021) //Use click event properties to write text for popup
        .addTo(map); //Show popup on map
});



/*--------------------------------------------------------------------
HOVER EVENT USING setFeatureState() METHOD
// --------------------------------------------------------------------*/
let provID = null; //Declare initial province ID as null

map.on('mousemove', 'provterr-fill', (e) => {
    if (e.features.length > 0) { //If there are features in array enter conditional

        if (provID !== null) { //If provID IS NOT NULL set hover feature state back to false to remove opacity from previous highlighted polygon
            map.setFeatureState(
                { source: 'canada-provterr', id: provID },
                { hover: false }
            );
        }

        provID = e.features[0].id; //Update provID to featureID
        map.setFeatureState(
            { source: 'canada-provterr', id: provID },
            { hover: true } //Update hover feature state to TRUE to change opacity of layer to 1
        );
    }
});


map.on('mouseleave', 'provterr-fill', () => { //If mouse leaves the geojson layer, set all hover states to false and provID variable back to null
    if (provID !== null) {
        map.setFeatureState(
            { source: 'canada-provterr', id: provID },
            { hover: false }
        );
    }
    provID = null;
});


