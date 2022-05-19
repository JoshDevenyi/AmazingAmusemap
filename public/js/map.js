
//Global Variable Declarations
let map;

var markers = [];

var infoWindow;

//Google Map Function
function initMap() {
    

    //Map Object. Declares map settings
    map = new google.maps.Map( document.getElementById("map"), {
        
        center: { lat: 43.843, lng: -79.539 },
        zoom: 6,
        streetViewControl: false,
        mapTypeId: 'hybrid'

    });

    //Add Marker Function
    function addMarker(park){
        
        //Icon Variable
        var icon = {

            url: '/images/ClockMarker.png', //url
            scaledSize: new google.maps.Size(50, 50), // scaled size

        }

        //Create Marker
        var marker = new google.maps.Marker({

            position: {lat: park.lat, lng: park.lng},
            map,
            title: park.name,
            icon: icon

        });


        //Sets up info windows. Makes sure only one can be open at a time.
        google.maps.event.addListener(marker, 'click', function() {

            if (infoWindow) {

                infoWindow.close();

            }

            infoWindow = new google.maps.InfoWindow({

                content: '<a href="/parks/'+park.id+'"><h1>'+park.name+'</h1></a>'

            });

            infoWindow.open( map, marker );

        });
        
        //Adds each individual marker to the markers array
        markers.push(marker);
    
    }
   

    //Loading Markers
    window.onload = function() {

        //Brings in park location data from unseen HTML list
        var parkData = document.getElementsByClassName("parkData");
        var parkList = [];
    
        //Formating imported data into JSON
        for (let i=-0; i < parkData.length; i++){
            parkList[i] =  JSON.parse(parkData[i].textContent);
        }

        //Add Markers to map with addMarker function
        for (let i=-0; i < parkList.length; i++){
            addMarker(parkList[i]);
        }

        //Creating Marker Cluster Icon
        var clusterIcon = {

            url: '/images/BlankMarker.png', //url
            scaledSize: new google.maps.Size(50, 50), // scaled size
            labelOrigin: new google.maps.Point(25.25, 18)

        }

        //Customizing Marker Clusters
        const renderer = {
            render: ({ count, position }) =>
              new google.maps.Marker({
                icon: clusterIcon, 
                label: { text: String(count), color: "white", fontSize: "22px" },
                position,
              }),
          };


        //Rendering Marker Clusters
        const markerCluster = new markerClusterer.MarkerClusterer({ map, markers, renderer});

    }

}
