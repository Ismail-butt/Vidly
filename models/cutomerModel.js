const mongoose = require('mongoose')
const Joi = require('joi')

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    isGold: {
        type: Boolean,
        default: false
    }
})

const Customer = new mongoose.model('Customer', customerSchema)


// check if the genre is valid according to the schema or not
const validCustomer = (customer) => {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean()
    }

    return Joi.validate(customer, schema)
}

// Exports Here
module.exports.Customer = Customer
module.exports.validate = validCustomer
