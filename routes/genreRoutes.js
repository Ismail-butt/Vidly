const mongoose = require('mongoose')
const Joi = require('joi')
const express = require('express')
const router = express.Router()

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
})

const Genre = new mongoose.model('Genre', genreSchema)

router.get('/', async (req, res) => {
    const genres = await Genre.find({}).sort('name')
    res.send(genres)
})

router.get('/:id', async (req, res) => {
    // find genre Here
    const genre = await Genre.findById(req.params.id)

    // if not found, return 404 (Resource not found)
    if(!genre) {
        return res.status(404).send('The genre with given ID was not found')
    }
    // if found then return the genre
    res.send(genre)
})

router.post('/', async (req, res) => {
    const {error} = validGenre(req.body)
    if(error) {
        // 400 - Bad Request
        return res.status(400).send(error.details[0].message)
    }
    
    // Valid
    let newGenre = new Genre({
        name: req.body.name
    })

    newGenre = await newGenre.save()
    res.send(newGenre)
})

router.put('/:id', async (req, res) => {
    const {error} = validGenre(req.body)
    if(error) {
        // 400 - Bad Request
        return res.status(400).send(error.details[0].message)
    }

    let genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
        new: true
    })

    if(!genre) {
        return res.status(404).send("The genre with given ID was not found")
    }

    res.send(genre)
})

router.delete('/:id', async (req, res) => {
    // Check if given id genre exist or not
    const genre = await Genre.findByIdAndRemove(req.params.id)

    if(!genre) {
        return res.status(404).send("The genre with given ID was not found")
    }

    res.send(genre) // return the genre, which is deleted
})


// check if the genre is valid according to the schema or not
const validGenre = (genre) => {
    const schema = {
        name: Joi.string().min(3).required()
    }

    return Joi.validate(genre, schema)
}

// Export all the routes
module.exports = router