var config = require('config')

// var sample = 'http://maps.google.com/maps/api/staticmap?&zoom=6&size=512x512&maptype=hybrid&path=color:red|weight:5|45.123,-123.595|46.456,-124.985|46.856,-124.685'

var base = 'http://maps.google.com/maps/api/staticmap?size=512x512&maptype=hybrid&path=color:red|weight:5'

module.exports.generateStaticMapURL = function (breadcrumbs) {
  // The first one is always lat, the second lon
  var result = base
  for (var i = 0; i < breadcrumbs.length; i++) {
    var coordinates = breadcrumbs[i].coordinates
    var lat = coordinates[0]
    var lon = coordinates[1]
    result = result + '|' + lat + ',' + lon
  }
  result = result + '&' + config.GOOGLE_API_TOKEN
  return result
}
