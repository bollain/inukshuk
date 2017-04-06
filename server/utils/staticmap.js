var config = require('config')

var base = 'http://maps.google.com/maps/api/staticmap?size=512x512&maptype=hybrid&path=color:red|weight:5'

// var markers '&markers=color:blue%7Clabel:E%7C46.866,-124.185&markers=color:blue%7Clabel:S%7C45.123,-123.595'
module.exports.generateStaticMapURL = function (trip) {
  // The first one is always lat, the second lon
  var result = base
  var coordinates
  var lat
  var lon
  // Only sample up to 50 points
  var interval = Math.max(Math.ceil(trip.breadCrumbs.length / 45), 1)
  var i = 0
  while (i < trip.breadCrumbs.length) {
    coordinates = trip.breadCrumbs[i].coordinates
    lat = coordinates[0]
    lon = coordinates[1]
    result = result + '|' + lat + ',' + lon
    if (trip.breadCrumbs.length - i <= 5) {
      i++
    } else {
      i += interval
    }
  }

  // Now add thhe markers
  var startingCoordinates = trip.startingLocation.coordinates
  var endingCoordinates = trip.endingLocation.coordinates
  var startMarker = '&markers=color:green|label:S|' + startingCoordinates[0] + ',' + startingCoordinates[1]
  var finishMarker = '&markers=color:red|label:F|' + endingCoordinates[0] + ',' + endingCoordinates[1]

  result = result + '&' + startMarker + '&' + finishMarker + '&' + config.GOOGLE_API_TOKEN
  return result
}
