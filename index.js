//IMPORT REQUIRED MODULES 
const express = require("express");
const path = require("path");
const fs = require("fs"); //file r/w module built-in to Node.js
const axios = require("axios");
const qs = require("querystring"); //built-in querystring module for manipulating query strings
const dotenv = require("dotenv");
const { application } = require("express");

dotenv.config();


//Set up an Express Object
const app = express(); //app is holding the Express object
const port = process.env.PORT || "8888";

const queueTimes = "https://queue-times.com/"

//Set up paths to important folders and/or files
app.set("views", path.join(__dirname, "views")); //Setting up where the views are found
app.set("view engine", "pug"); //Setting PUG as our view engine.

//CSS and Client-Side JS are static files //app.use used to set static file paths
app.use(express.static(path.join(__dirname, "public")));


//PAGE ROUTES
app.get("/", (req, res) => {
    
  listThemeParks(res, "Home", "index");

});


app.get("/parks", (req, res) => {

  listThemeParks(res, "Park List", "parks");

});


app.get("/parks/:id", (req, res) => {

  let id = req.params.id;
  getParkById(res, id)

});


//Set up server listening
app.listen(port, () => {

  console.log(`Listening on http://localhost:${port}`)

});


//Function to display Theme Parks list
function listThemeParks (res, title, route) {
  var pageData = {

    title: title,
    companies: null

  }
  axios(
    //Park list request
    {
      url: "/parks.json",
      baseURL: queueTimes,
      method: "get"
    }
  ).then(function (response) {
    //On success do stuff
    pageData.companies = response.data;
    res.render(route, pageData);
  }).catch(function (error){
    console.log(error);
  });
}

//Function to get information on each Theme Parks, required 2 axios requests to get all data
function getParkById (res, id) {
  var pageData = {

    title: "Park",
    attractions: null,
    hasLands: null,
    hasRides: null,
    park: null,
  }
  axios(
    //The Request
    {
      url: "/parks/"+id+"/queue_times.json",
      baseURL: queueTimes,
      method: "get"
    }
  ).then(function (response1) {

      axios(
        //park list request
        {
          url: "/parks.json",
          baseURL: queueTimes,
          method: "get"
        }
      ).then(function (response2) {
        
      //Loop to find applicable park in list data call
      for (let i= 0; i < Object.keys( response2.data ).length; i++){
        for (let j= 0; j < Object.keys( response2.data[i].parks ).length; j++){
          var pageId = parseInt(id);
          if(response2.data[i].parks[j].id === pageId){
            pageData.title = response2.data[i].parks[j].name;
            pageData.park = response2.data[i].parks[j] ;
          }
        }
      }

      //Checks if rides from API are further seperated into land categories or not
      if( Object.keys( response1.data.lands ).length == 0 ) {

        pageData.hasLands = false;

        //Checks if rides data exists
        if( Object.keys( response1.data.rides ).length != 0 ) {
          pageData.hasRides = true;
        }

        else{
          pageData.hasRides = false;
        }

      }

      else{

        pageData.hasLands = true;

      }
      
      pageData.attractions = response1.data;

      res.render("park", pageData); //Stores results in pageData.park

      }).catch(function (error){
        console.log(error);
      });

  }).catch(function (error){

    console.log(error);

  });
}


