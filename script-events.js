/*--------------------------------------------------------------------
GGR472 WEEK 6: JavaScript for Web Maps
MapData and MapMouse Events
--------------------------------------------------------------------*/


//Define access token
mapboxgl.accessToken = 'pk.eyJ1IjoibGdzbWl0aCIsImEiOiJja29uNGs1cmYwYnN2MnBwMzM2cDQyN2NrIn0.lZvjUUK8Pc2JDq0tuSRrKQ'; //*** ADD PUBLIC ACCESS TOKEN HERE ***

//Initialize map
const map = new mapboxgl.Map({
    container: 'my-map',
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
    map.addSource('canada-provterr', {
        'type': 'vector',
        'url': 'mapbox://lgsmith.843obi8n'
    });

    map.addLayer({
        'id': 'provterr-fill',
        'type': 'fill',
        'source': 'canada-provterr',
        'paint': {
            'fill-color': '#627BC1',
            'fill-opacity': 0.5,
            'fill-outline-color': 'white'
        },
        'source-layer': 'can-provterr2021-9crjaq'
    });

    //Add another visualization of the polygon of provinces. Note we do not use addsource again
    map.addLayer({
        'id': 'provterr-hl', //Update id to represent highlighted layer
        'type': 'fill',
        'source': 'canada-provterr',
        'paint': {
            'fill-color': '#627BC1',
            'fill-opacity': 1, //Opacity set to 1
            'fill-outline-color': 'white'
        },
        'source-layer': 'can-provterr2021-9crjaq',
        'filter': ['==', ['get', 'PRUID'], ''] //Set an initial filter to return nothing
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
// map.on('mouseenter', 'provterr-fill', () => {
//     map.getCanvas().style.cursor = 'pointer'; //Switch cursor to pointer when mouse is over provterr-fill layer
// });

// map.on('mouseleave', 'provterr-fill', () => {
//     map.getCanvas().style.cursor = ''; //Switch cursor back when mouse leaves provterr-fill layer
//     map.setFilter("provterr-hl", ['==', ['get', 'PRUID'], '']); //Reset filter for highlighted layer after mouse leaves feature
// });


// map.on('click', 'provterr-fill', (e) => {
//     new mapboxgl.Popup() //Declare new popup object on each click
//         .setLngLat(e.lngLat) //Use method to set coordinates of popup based on mouse click location
//         .setHTML("<b>Province/Territory:</b> " + e.features[0].properties.PRENAME + "<br>" +
//             "Population: " + e.features[0].properties.POP2021) //Use click event properties to write text for popup
//         .addTo(map); //Show popup on map
// });


/*--------------------------------------------------------------------
SIMPLE HOVER EVENT
// --------------------------------------------------------------------*/
//  map.on('mousemove', 'provterr-fill', (e) => {
//     if (e.features.length > 0) { //if there are features in the event features array (i.e features under the mouse hover) then go into the conditional

//         //set the filter of the provinces-hl to display the feature you're hovering over
//         //e.features[0] is the first feature in the array and properties.PRUID is the Province ID for that feature
//         map.setFilter('provterr-hl', ['==', ['get', 'PRUID'], e.features[0].properties.PRUID]);

//     }
//  });

