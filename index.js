const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const mongoose = require('mongoose')
const express = require('express')

const genreRoutes = require('./routes/genreRoutes')
const customerRoutes = require('./routes/customerRoutes')
const movieRoutes = require('./routes/movieRoutes')
const rentalRoutes = require('./routes/rentalRoutes')

const app = express()

mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected to MongoDb...'))
    .catch((err) => console.log('Could not connect to MongoDb...', err.message))

app.use(express.json())

app.use('/api/genres', genreRoutes)
app.use('/api/customers', customerRoutes)
app.use('/api/movies', movieRoutes)
app.use('/api/rentals', rentalRoutes);

app.get('/', (req, res) => {
    res.send('App is running...')
})

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Listening at Port ${port}...`))


// ------------------ Notes -------------------

// - Transaction
// it is possible that one async operation doesn't Complete like rental or MongoDb Connection Drops. then the second Async Operation will not be complete
// That's where we need TRANSACTION operation. Transaction makes sure that both Async Operation Completes (means both will update the state or none of this will apply) or Both not. So, They are Atomic. They both completes or both roll back.
// It is not present in Non-Relation database, Only in Relational Database.
// They are technique that is Two phase Commits through which we can implement Transaction but it is - Advanced Topic
// NPM Package that will simulate Transaction in Mongoose.

// Transaction
// A group of operations that should be performed as a unit. So, either all these operation will complete and change the state of the database or if any of the operation fails, we will roll back and database will go back to initial state.
// In MongoDb, we don't have Transaction.
// There is a technique that is Two phase Commits through which we can implement Transaction but it is - Advanced Topic
// NPM Package Fawn that will simulate Transaction in Mongoose.

// Information about MongoDB id

// - We don't need to get Movie Object from .save() method bcz Id is genrated by Mongod(Mongo Driver), not mongodb. So, we can change let newMovie to const newMovie xd.

// _id in MongoDB Document 

// _id: 633c49042f9cfe9beac787ff

// 12 bytes, 2chars = 1 byte
    // 4 bytes: timestamp
    // 3 bytes: machine indentifier
    // 2 bytes: process identifier
    // 3 bytes: counter

// 1 byte 8 bits
// 2 ^ 8 = 256
// 2 ^ 24  = 16M

// Driver -> MongoDB