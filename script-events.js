/*--------------------------------------------------------------------
GGR472 WEEK 6: JavaScript for Web Maps
Events
--------------------------------------------------------------------*/


//Define access token
mapboxgl.accessToken = 'pk.eyJ1IjoibGdzbWl0aCIsImEiOiJja29uNGs1cmYwYnN2MnBwMzM2cDQyN2NrIn0.lZvjUUK8Pc2JDq0tuSRrKQ';

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
    // map.addSource('canada-provterr', {
    //     'type': 'vector',
    //     'url': 'mapbox://lgsmith.843obi8n'
    // });

    map.addSource('canada-provterr', {
        type: 'geojson',
        data: 'https://smith-lg.github.io/ggr472-wk6-demo/data/test.geojson'
        //'https://raw.githubusercontent.com/smith-lg/ggr472-wk6-demo/main/data/map.geojson?token=GHSAT0AAAAAAB6ZYVHU7OWQHMQCP44SMXEQY7MRGQA'
    });


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
        //'source-layer': 'can-provterr2021-9crjaq'
    });

    // map.addLayer({
    //     'id': 'provterr-hl',
    //     'type': 'fill',
    //     'source': 'canada-provterr',
    //     'paint': {
    //         'fill-color': '#627BC1',
    //         'fill-opacity': 1,
    //         'fill-outline-color': 'white'
    //     },
    //     'source-layer': 'can-provterr2021-9crjaq',
    //     'filter': ['==', ['get', 'PRUID'], '']
    // });

});



// ['boolean', ['feature-state', 'hover'], false],
// [
//     'case',
//     ['==', ['get', 'id'], ['feature-state', 'id']],
//     1, 0,
//   ]

// [
//     'case',
//     ['==', ['get', 'PRUID'],['feature-state', 'hover']],
//     1,
//     0.5]


/*--------------------------------------------------------------------
SIMPLE CLICK EVENT
--------------------------------------------------------------------*/
map.on('click', 'provterr-fill', (e) => {

    //console.log(e);   //e is the event info triggered and is passed to the function as a parameter (e)
    //Explore console output using Google DevTools

    let provname = e.features[0].properties.PRENAME;
    console.log(provname);

})


/*--------------------------------------------------------------------
ADD POP-UP ON CLICK EVENT
--------------------------------------------------------------------*/
map.on('mouseenter', 'provterr-fill', () => {
    map.getCanvas().style.cursor = 'pointer'; //Switch cursor to pointer when mouse is over provterr-fill layer
});

map.on('mouseleave', 'provterr-fill', () => {
    map.getCanvas().style.cursor = ''; //Switch cursor back when mouse leaves provterr-fill layer
    //map.setFilter("provterr-hl",['==', ['get', 'PRUID'], '']);
});


map.on('click', 'provterr-fill', (e) => {
    new mapboxgl.Popup() //Declare new popup object on each click
        .setLngLat(e.lngLat) //Use method to set coordinates of popup based on mouse click location
        .setHTML("<b>Province/Territory:</b> " + e.features[0].properties.PRENAME + "<br>" +
            "Population: " + e.features[0].properties.POP2021) //Use click event properties to write text for popup
        .addTo(map); //Show popup on map
})




/*--------------------------------------------------------------------
HOVER EVENT
// --------------------------------------------------------------------*/
//  map.on('mousemove', 'provterr-fill', (e) => {
//     if (e.features.length > 0) {
//         map.setFilter("provterr-hl",['==', ['get', 'PRUID'], e.features[0].properties.PRUID]);
//     }
//  });
let provID = null;

map.on('mousemove', 'provterr-fill', (e) => {
    if (e.features.length > 0) {
        if (provID !== null) {
            map.setFeatureState(
                { source: 'canada-provterr', id: provID },
                { hover: false }
            );
        }
        provID = e.features[0].id;
        map.setFeatureState(
            { source: 'canada-provterr', id: provID },
            { hover: true }
        );
    }
});

// When the mouse leaves the state-fill layer, update the feature state of the
// previously hovered feature.
map.on('mouseleave', 'provterr-fill', () => {
    if (provID !== null) {
        map.setFeatureState(
            { source: 'canada-provterr', id: provID },
            { hover: false }
        );
    }
    provID = null;
});





// map.on('mousemove', 'provterr-fill', (e) => {
//     if (e.features.length > 0) {
//         if (provID) {
//             console.log('a');
//             map.setFeatureState(
//                 { source: 'canada-provterr', id: provID },
//                 { hover: false }
//             );
//         }

//         provID = e.features[0].id;
//         console.log('b');
//         map.setFeatureState(
//             { source: 'canada-provterr', id: provID },
//             { hover: true }
//         );

//     }

// });


//     if (e.features.length > 0) { //if there are features in the event features array (i.e features under the mouse hover) then go into the conditional

//         //provHoverId = e.features[0].id;
//         //console.log(provHoverId);


//         if (provHoverId) {
//             map.setFeatureState({
//                 source: 'canada-provterr',
//                 sourceLayer: 'can-provterr2021-9crjaq',
//                 id: e.features[0].id
//             },
//             {hover: 0}
//             );
//         }

//         provHoverId = e.features[0].properties.PRUID;
//         map.setFeatureState({
//             source: 'canada-provterr',
//             sourceLayer: 'can-provterr2021-9crjaq',
//             id: e.features[0].id
//         },
//         {hover: provHoverId}
//         );

//         console.log(provHoverId);
//     }




// map.on('mousemove', 'state-fills', (e) => {
//     if (e.features.length > 0) {
//         if (hoveredStateId !== null) {
//             map.setFeatureState(
//                 { source: 'states', id: hoveredStateId },
//                 { hover: false }
//             );
//         }
//         hoveredStateId = e.features[0].id;
//         map.setFeatureState(
//             { source: 'states', id: hoveredStateId },
//             { hover: true }
//         );
//     }
// });