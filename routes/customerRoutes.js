const mongoose = require('mongoose')
const Joi = require('joi')
const express = require('express')
const router = express.Router()

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

router.get('/', async (req, res) => {
    const customers = await Customer.find({}).sort('name')
    res.send(customers)
})

router.get('/:id', async (req, res) => {
    // find customer Here
    const customer = await Customer.findById(req.params.id)

    // if not found, return 404 (Resource not found)
    if(!customer) {
        return res.status(404).send('The customer with given ID was not found')
    }

    // if found then return the genre
    res.send(customer)
})

router.post('/', async (req, res) => {
    const {error} = validCustomer(req.body)

    if(error) {
        // 400 - Bad Request
        return res.status(400).send(error.details[0].message)
    }
    
    // Valid
    let newCustomer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    })

    newCustomer = await newCustomer.save()
    res.send(newCustomer)
})

router.put('/:id', async (req, res) => {
    const {error} = validCustomer(req.body)
    if(error) {
        // 400 - Bad Request
        return res.status(400).send(error.details[0].message)
    }

    // if Valid, then find the Customer and Update it.
    let customer = await Customer.findByIdAndUpdate(req.params.id, { 
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold 
    }, {
        new: true
    })

    if(!customer) {
        return res.status(404).send("The Customer with given ID was not found")
    }

    res.send(customer)
})

router.delete('/:id', async (req, res) => {
    // Check if given id genre exist or not
    const customer = await Customer.findByIdAndRemove(req.params.id)

    if(!customer) {
        return res.status(404).send("The Customer with given ID was not found")
    }

    res.send(customer) // return the genre, which is deleted
})


// check if the genre is valid according to the schema or not
const validCustomer = (customer) => {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean()
    }

    return Joi.validate(customer, schema)
}

// Export all the routes
module.exports = router