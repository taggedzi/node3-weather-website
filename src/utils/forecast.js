const request = require('postman-request')
try {
    // test for local
    const keys = require('./keys')
    const key = keys.weatherstackApiKey
} catch (err) {
    // test for production
    const key = process.env.weatherstackApiKey
}


// weatherstack options
const weatherstackUnits = 'f'  // m = metric, f = fahrenheit, s = scientific (kelvin)
const weatherstackUrl = (key, lat, long, units) => `http://api.weatherstack.com/current?access_key=${key}&query=${lat},${long}&units=${units}`

const forcast = (latitude, longitude, callback) => {
    const url = weatherstackUrl(keys.weatherstackApiKey, latitude, longitude, weatherstackUnits)
    request({url, json: true}, (error, { body }) => {
        if (error) {
            callback(error, undefined)
        } else if (body.error) {
            callback('Unable to find location. Try a different search.', undefined)
        } else {
            const { weather_descriptions:descriptions, temperature, feelslike } = body.current
            const output = `${descriptions[0]}. It is currently ${temperature} degrees out. It feels like ${feelslike} degrees out.`
            callback(undefined, output)
        }
    })
}

module.exports = forcast

// Successful Call
// {
//     "request": {
//         "type": "LatLon",
//         "query": "Lat 34.27 and Lon -77.85",
//         "language": "en",
//         "unit": "f"
//     },
//     "location": {
//         "name": "Smith Creek",
//         "country": "United States of America",
//         "region": "North Carolina",
//         "lat": "34.263",
//         "lon": "-77.864",
//         "timezone_id": "America\/New_York",
//         "localtime": "2022-02-25 04:23",
//         "localtime_epoch": 1645762980,
//         "utc_offset": "-5.0"
//     },
//     "current": {
//         "observation_time": "09:23 AM",
//         "temperature": 55,
//         "weather_code": 143,
//         "weather_icons": ["https:\/\/assets.weatherstack.com\/images\/wsymbols01_png_64\/wsymbol_0006_mist.png"],
//         "weather_descriptions": ["Mist"],
//         "wind_speed": 0,
//         "wind_degree": 0,
//         "wind_dir": "N",
//         "pressure": 1022,
//         "precip": 0,
//         "humidity": 97,
//         "cloudcover": 100,
//         "feelslike": 54,
//         "uv_index": 1,
//         "visibility": 1,
//         "is_day": "no"
//     }
// }

// Failed call (bad location)
// {
//     "success": false,
//     "error": {
//         "code": 615,
//         "type": "request_failed",
//         "info": "Your API request failed. Please try again or contact support."
//     }
// }