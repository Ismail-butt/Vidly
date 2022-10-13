const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const { User, validate } = require('../models/userModel')
const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    const users = await User.find({}).sort('name')
    res.send(users)
})

router.get('/:id', async (req, res) => {
    // find genre Here
    const user = await User.findById(req.params.id)

    // if not found, return 404 (Resource not found)
    if(!user) {
        return res.status(404).send('The user with given ID was not found')
    }
    // if found then return the genre
    res.send(user)
})

router.post('/', async (req, res) => {
    const {error} = validate(req.body)
    if(error) {
        // 400 - Bad Request
        return res.status(400).send(error.details[0].message)
    }

    const { name, email, password } = req.body

    // Find if user already exists
    const usersExists = await User.findOne({ email })
    if (usersExists) {
        res.status(400)
        return res.status(400).send("User already exists")
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    let newUser = new User({
        name,
        email,
        password: hashedPassword,
    })
    try {
        await newUser.save()
        // 1. Basically, we create json web token with the playload of (user id or user Object), when user register/login.
        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            token: generateToken(newUser._id),
        })
    } catch (error) {
        res.status(400).send("Invalid user Data")
    }
    
})

router.put('/:id', async (req, res) => {
    const {error} = validate(req.body)
    if(error) {
        // 400 - Bad Request
        return res.status(400).send(error.details[0].message)
    }

    let user = await User.findByIdAndUpdate(req.params.id, 
        { name: req.body.name,
        email: req.body.email,
        password: req.body.password, 
        }, {
        new: true
    })

    if(!user) {
        return res.status(404).send("The user with given ID was not found")
    }

    res.send(user)
})

router.delete('/:id', async (req, res) => {
    // Check if given id genre exist or not
    const user = await User.findByIdAndRemove(req.params.id)

    if(!user) {
        return res.status(404).send("The user with given ID was not found")
    }

    res.send(user) // return the genre, which is deleted
})

// Generate token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    }) // process.env.JWT_SECRET Store a signature / Private Key
}

// Export all the routes
module.exports = router