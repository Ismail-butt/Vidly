const mongoose = require('mongoose')
const Joi = require('joi')

const { genreSchema } = require('./genreModel')

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255
    },
    genre: {
        type: genreSchema,
        required: true,
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
    },

})

const Movie = new mongoose.model('Movie', movieSchema)

// check if the genre is valid according to the schema or not
const validMovie = (movie) => {
    const schema = {
        title: Joi.string().min(5).max(255).required(),
        genreId: Joi.objectId().required(), // Why genreId bcz client will only genreId to us, he will not provide whole genre man. 
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required(),
    }

    return Joi.validate(movie, schema)
}

// Exports Here
module.exports.Movie = Movie
module.exports.validate = validMovie