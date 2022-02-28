const request = require('postman-request')
try {
    // test for local
    const keys = require('./keys')
    const key = keys.mapboxApiKey
} catch (err) {
    // test for production
    const key = process.env.mapboxApiKey
}

// mapbox options
// https://docs.mapbox.com/api/search/geocoding/
const mapboxEndpoint = 'mapbox.places'
const mapboxMaxResults = 1
const mapboxLanguage = 'en'
const mapboxTypes = 'place,postcode,address'
const geocodeURLTemplate = (key, 
    mapboxEndpoint, 
    mapboxLanguage, 
    mapboxMaxResults, 
    mapboxLocation, 
    mapboxTypes) => `https://api.mapbox.com/geocoding/v5/${mapboxEndpoint}/${mapboxLocation}.json?types=${mapboxTypes}&limit=${mapboxMaxResults}&language=${mapboxLanguage}&access_token=${key}`


const geocode = (address, callback) => {
    const url = geocodeURLTemplate(keys.mapboxApiKey, mapboxEndpoint, mapboxLanguage, mapboxMaxResults, encodeURIComponent(address), mapboxTypes)
    request({url, json: true}, (error, { body }) => {
        if (error) {
            callback(error, undefined)
        } else if (body.features.length === 0) {
            callback('Unable to find location.', undefined)
        } else {
            const {place_name:location, center} = body.features[0]
            callback(undefined, {
                location,
                latitude: center[1],
                longitude: center[0]
            })
        }
    })
}

module.exports = geocode

// Sample good call:
// {
//     "type": "FeatureCollection",
//     "query": ["28584"],
//     "features": [{
//         "id": "postcode.9574676004932250",
//         "type": "Feature",
//         "place_type": ["postcode"],
//         "relevance": 1,
//         "properties": {},
//         "text_en": "28584",
//         "place_name_en": "Cape Carteret, North Carolina 28584, United States",
//         "text": "28584",
//         "place_name": "Cape Carteret, North Carolina 28584, United States",
//         "bbox": [-77.179870945, 34.665329048, -76.957321, 34.81132],
//         "center": [-77.07, 34.69],
//         "geometry": {
//             "type": "Point",
//             "coordinates": [-77.07, 34.69]
//         },
//         "context": [{
//             "id": "place.12275939004147130",
//             "text_en": "Cape Carteret",
//             "text": "Cape Carteret"
//         }, {
//             "id": "district.8638889077976010",
//             "wikidata": "Q497817",
//             "text_en": "Carteret County",
//             "language_en": "en",
//             "text": "Carteret County",
//             "language": "en"
//         }, {
//             "id": "region.7109819773854480",
//             "short_code": "US-NC",
//             "wikidata": "Q1454",
//             "text_en": "North Carolina",
//             "language_en": "en",
//             "text": "North Carolina",
//             "language": "en"
//         }, {
//             "id": "country.19678805456372290",
//             "wikidata": "Q30",
//             "short_code": "us",
//             "text_en": "United States",
//             "language_en": "en",
//             "text": "United States",
//             "language": "en"
//         }]
//     }],
//     "attribution": "NOTICE: © 2022 Mapbox and its suppliers. All rights reserved. Use of this data is subject to the Mapbox Terms of Service (https://www.mapbox.com/about/maps/). This response and the information it contains may not be retained. POI(s) provided by Foursquare."
// }