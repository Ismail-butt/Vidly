const Joi = require('joi')
const express = require('express')
const router = express.Router()

const genres = [
    { id: 1, name: 'Action' },  
    { id: 2, name: 'Horror' },  
    { id: 3, name: 'Romance' },  
];

router.get('/', (req, res) => {
    res.send(genres)
})

router.get('/:id', (req, res) => {
    // find genre Here
    const genre = genres.find(g => g.id === parseInt(req.params.id))

    // if not found, return 404 (Resource not found)
    if(!genre) {
        return res.status(404).send('The genre with given ID was not found')
    }
    // if found then return the genre
    res.send(genre)
})

router.post('/', (req, res) => {
    const {error} = validGenre(req.body)
    if(error) {
        // 400 - Bad Request
        return res.status(400).send(error.details[0].message)
    }
    
    // Valid
    const newGenre = {
        id: genres.length + 1,
        name: req.body.name
    }

    // Add the genre to the genre Arr
    genres.push(newGenre)
    res.send(newGenre)
})

router.put('/:id', (req, res) => {
    // Check if given id genre exist or not
    const genre = genres.find(g => g.id === parseInt(req.params.id))
    if(!genre) {
        return res.status(404).send("The genre with given ID was not found")
    }

    // if Exists, then check if req.body is valid or not
    const {error} = validGenre(req.body)
    if(error) {
        // 400 - Bad Request
        return res.status(400).send(error.details[0].message)
    }

    // if all is well, then update the given id genre
    genre.name = req.body.name
    res.send(genre)
})

router.delete('/:id', (req, res) => {
    // Check if given id genre exist or not
    const genre = genres.find(g => g.id === parseInt(req.params.id))
    if(!genre) {
        return res.status(404).send("The genre with given ID was not found")
    }

    // if exists, then delete the given genre
    const index = genres.indexOf(genre)
    genres.splice(index, 1) // deleting the genre here

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