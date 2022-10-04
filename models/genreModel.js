const mongoose = require('mongoose')
const Joi = require('joi')

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
})

const Genre = new mongoose.model('Genre', genreSchema)

// check if the genre is valid according to the schema or not
const validGenre = (genre) => {
    const schema = {
        name: Joi.string().min(3).required()
    }

    return Joi.validate(genre, schema)
}

// Exports Here
module.exports.Genre = Genre
module.exports.validate = validGenre