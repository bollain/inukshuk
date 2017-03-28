var config = require('config')

var base = 'http://maps.google.com/maps/api/staticmap?size=512x512&maptype=hybrid&path=color:red|weight:5'

// var markers '&markers=color:blue%7Clabel:E%7C46.866,-124.185&markers=color:blue%7Clabel:S%7C45.123,-123.595'
module.exports.generateStaticMapURL = function (trip) {
  // The first one is always lat, the second lon
  var result = base
  for (var i = 0; i < trip.breadCrumbs.length; i++) {
    var coordinates = trip.breadCrumbs[i].coordinates
    var lat = coordinates[0]
    var lon = coordinates[1]
    result = result + '|' + lat + ',' + lon
  }
  // Now add thhe markers
  var startingCoordinates = trip.startingLocation.coordinates
  var endingCoordinates = trip.endingLocation.coordinates
  var startMarker = '&markers=color:blue|label:S|' + startingCoordinates[0] + ',' + startingCoordinates[1]
  var finishMarker = '&markers=color:blue|label:F|' + endingCoordinates[0] + ',' + endingCoordinates[1]

  result = result + '&' + startMarker + '&' + finishMarker + '&' + config.GOOGLE_API_TOKEN
  return result
}
