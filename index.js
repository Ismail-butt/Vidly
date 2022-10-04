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


// - Transaction
// it is possible that one async operation doesn't Complete like rental or MongoDb Connection Drops. then the second Async Operation will not be complete
// That's where we need TRANSACTION operation. Transaction makes sure that both Async Operation Completes (means both will update the state or none of this will apply) or Both not. So, They are Atomic. They both completes or both roll back.
// It is not present in Non-Relation database, Only in Relational Database.
// They are technique that is Two phase Commits through which we can implement Transaction but it is - Advanced Topic
// NPM Package that will simulate Transaction in Mongoose.