const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forcast = require('./utils/forecast')

const app = express()

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// setup handlebars and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Matt'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Matt'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Matt',
        msg: 'Here is a help msg.'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address.'
        })
    }
    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if (error) { 
            return res.send({ error })
        } 
        forcast(latitude, longitude, (error, forecastData) => {
            if (error) { 
                return res.send({ error }) 
            }
            return res.send({
                address: req.query.address,
                forecast: forecastData,
                location
            })
        })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term.'
        })
    }

    console.log(req.query.search)
    res.send({
        product: []
    })

})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Help article not found.',
        errorMsg: 'We were unable to locate the requested help article.',
        name: 'System'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404 page not found',
        errorMsg: 'Unable to locate page.',
        name: 'System'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})

// C:\Users\tagge\Google Drive\Documents\Class and Book Notes\The Complete Nodejs Dev course\projects\web-server\src
// C:\Users\tagge\Google Drive\Documents\Class and Book Notes\The Complete Nodejs Dev course\projects\web-server\src\app.js