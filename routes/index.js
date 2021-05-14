var express = require("express");
var router = express.Router();

/* PostgreSQL and PostGIS module and connection setup */
const { Client, Query } = require("pg");



// Set up your database query to display GeoJSON
var parking_lots_query =
  "SELECT row_to_json(fc) FROM (SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type,ST_AsGeoJSON(lg.geom)::json As geometry,row_to_json((id, name,address)) As properties FROM mumbai_parking_lots As lg ) As f) As fc";

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Home" });
});

router.get("/data", (req, res) => {
  var client = new Client({
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 5432,
    host: process.env.DB_HOST,
    ssl: true
  });
  client.connect();
  var query = client.query(new Query(parking_lots_query));
  query.on("row", (row, result) => {
    result.addRow(row);
  });
  query.on("end", (result) => {
    res.send(result.rows[0].row_to_json);
    res.end();
  });
});

router.get("/map", (req, res) => {
  var client = new Client({
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 5432,
    host: process.env.DB_HOST,
    ssl: true
  });

  client.connect();
  var query = client.query(new Query(parking_lots_query));
  query.on("row", (row, result) => {
    result.addRow(row);
  });
  //pass the results to map page
  query.on("end", (result) => {
    var data = result.rows[0].row_to_json;
    res.render("map", {
      title: "Map",
      jsonData: data, //pass the geojson data
      getDistance: getDistance,
      selectedLat:0,
      selectedLon:0
    });
  });
});

router.get("/filter*", (req, res) => {
  console.log(req.query)
  var name = req.query.name
  var areaname = req.query.areaname
  console.log(name)
  const index = name.indexOf(",")
  var lats = name.substring(1,index)
  var lons = name.substring(index+1,name.length-1)
  console.log(lats+lons)
  const lat = Number(name.substring(1,index))
  const lon = Number(name.substring(index+1,name.length-1))
  var filter_query =
    "SELECT row_to_json(fc) FROM (SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type,ST_AsGeoJSON(lg.geom)::json As geometry,row_to_json((id, name,address)) As properties FROM mumbai_parking_lots As lg WHERE 1=1 AND ST_DISTANCE(ST_TRANSFORM(ST_GEOMFROMTEXT('POINT("+lons+" "+lats+")',4326), 7755),ST_TRANSFORM((geom),7755)) <= 5000 ) As f) As fc";
  console.log(filter_query)
  var client = new Client({
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 5432,
    host: process.env.DB_HOST,
    ssl: true
  });
  client.connect();
  var query = client.query(new Query(filter_query));
  query.on("row", (row, result)=>{
    result.addRow(row);
  });
  console.log(lat)
  console.log(lon)
  const selectedCoordinates = [lat,lon]
  console.log(selectedCoordinates)
  query.on("end", (result)=> {
    var data = result.rows[0].row_to_json;
    console.log(data)
    if(data.features===null){
      data.features=[]
    }
    res.render("map", {
      title: "Map",
      jsonData: data,
      getDistance: getDistance,
      selectedLat: lat,
      selectedLon: lon,
      areaname:areaname
    });
  });
});


router.get('/about',(req,res)=>{
  res.render('about',{
    title:"About"
  })
})

function getDistance(origin, destination) {
  const toRadian = (degree)=>{
    return degree*Math.PI/180;
  } 
  // return distance in meters
  var lon1 = toRadian(origin[1]),
      lat1 = toRadian(origin[0]),
      lon2 = toRadian(destination[1]),
      lat2 = toRadian(destination[0]);

  var deltaLat = lat2 - lat1;
  var deltaLon = lon2 - lon1;

  var a = Math.pow(Math.sin(deltaLat/2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon/2), 2);
  var c = 2 * Math.asin(Math.sqrt(a));
  var EARTH_RADIUS = 6371;
  return c * EARTH_RADIUS * 1000;
}





module.exports = router;


