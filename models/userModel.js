const mongoose = require('mongoose')
const Joi = require('joi')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 155
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    }
})

const User = new mongoose.model('User', userSchema)


// check if the genre is valid according to the schema or not
const validateUser = (user) => {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
    }

    return Joi.validate(user, schema)
}

// Exports Here
module.exports.User = User
module.exports.validate = validateUser
