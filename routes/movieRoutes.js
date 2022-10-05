const {Movie, validate} = require('../models/movieModel')
const { Genre } = require('../models/genreModel')
const express = require('express')
const router = express.Router()



router.get('/', async (req, res) => {
    const movies = await Movie.find({}).sort('title')
    res.send(movies)
})

router.get('/:id', async (req, res) => {
    // find customer Here
    const movie = await Movie.findById(req.params.id)

    // if not found, return 404 (Resource not found)
    if(!movie) {
        return res.status(404).send('The movie with given ID was not found')
    }

    // if found then return the genre
    res.send(movie)
})

// Note - we are doing this bcz what if genre has 50 properties, we don't want to add 50. we just want to add the properties which we want. Also, _v is also present in a document, we also don't want to add it. That's why we choose this method man.

router.post('/', async (req, res) => {
    const {error} = validate(req.body)

    if(error) {
        // 400 - Bad Request
        return res.status(400).send(error.details[0].message)
    }

    // console.log("Genre Id: ", req.body.genreId)

    const genre = await Genre.findById(req.body.genreId)
    // if not found, return 404 (Resource not found)
    if(!genre) {
        return res.status(404).send('The genre with given ID was not found')
    }
    
    // Valid
    const newMovie = new Movie({
        title: req.body.title,
        genre: { // Note - we are doing this bcz what if genre has 50 properties, we don't want to add 50. we just want to add the properties which we want. Also, _v is also present in a document, we also don't want to add it. That's why we choose this method man.
            _id: genre._id,
            name: genre.name,
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
    })

    await newMovie.save() // - We don't need to get Movie Object from .save() method bcz Id is genrated by Mongod(Mongo Driver), not mongodb. So, we can change let newMovie to const newMovie xd.
    res.send(newMovie)
})

router.put('/:id', async (req, res) => {
    const {error} = validate(req.body)
    if(error) {
        // 400 - Bad Request
        return res.status(400).send(error.details[0].message)
    }

    const genre = await Genre.findById(req.body.genreId)
    // if not found, return 404 (Resource not found)
    if(!genre) {
        return res.status(404).send('The genre with given ID was not found')
    }

    // if Valid, then find the Customer and Update it.
    let movie = await Movie.findByIdAndUpdate(req.params.id, { 
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name,
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate, 
    }, {
        new: true
    })

    if(!movie) {
        return res.status(404).send("The Movie with given ID was not found")
    }

    res.send(movie)
})

router.delete('/:id', async (req, res) => {
    // Check if given id genre exist or not
    const movie = await Movie.findByIdAndRemove(req.params.id)

    if(!movie) {
        return res.status(404).send("The Movie with given ID was not found")
    }

    res.send(movie) // return the genre, which is deleted
})

// Export all the routes
module.exports = router