let invisMap;
let service;


//Function that outputs a queue of stickfigures to the desired location based on the inputed time
function createQueue(div, time) {

    var tag = '<img src="/images/stickman.png" alt="a black stickman walking" width="25"></img>';
  
    for (let i = time; i > 0; i = i - 5) {
  
      div.insertAdjacentHTML("afterend", tag);
  
    }
    
}


function initMap() {

    let parkName = document.getElementById("parkHeading").innerHTML;
    let parkCoords = JSON.parse(document.getElementById("parkCoords").textContent);
    invisMap = new google.maps.Map(document.getElementById("invisMap"));

    var request = {
        query: parkName + " Amusement Park",
        fields: ['photos'],
        locationBias: parkCoords,
    };

    var service = new google.maps.places.PlacesService(invisMap);
    parkImageBox = document.getElementById("parkImageBox");

    service.findPlaceFromQuery(request, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            parkImage.src=results[0].photos[0].getUrl({maxWidth: 500});
            parkImage.style.display = "inline-block";
        }
        else{
            parkImage.style.display = "none";
        }
    });

}




window.onload = function() {

    //CREATING WAIT LINE GRAPHICS
    //Grabs all of the wait times on the given page
    waitTimes = document.getElementsByClassName("waitTime");

    //Grabs each ride's empty div that a possible queue will be outputed to
    waitLines = document.getElementsByClassName("waitLine");

    //Loops through all of a parks rides
    for (let i= 0; i < waitTimes.length; i++){

        var output = waitLines[i];

        //Turns string content from HTML to a Int variable
        var time = parseInt(waitTimes[i].textContent);

        //Puts data into the createQueue function
        createQueue(output, time);
    }




}


