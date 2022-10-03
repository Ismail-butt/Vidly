const mongoose = require('mongoose')
const express = require('express')

const genreRoutes = require('./routes/genreRoutes')
const customerRoutes = require('./routes/customerRoutes')

const app = express()

mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected to MongoDb...'))
    .catch((err) => console.log('Could not connect to MongoDb...', err.message))

app.use(express.json())

app.use('/api/genres', genreRoutes)
app.use('/api/customers', customerRoutes)

app.get('/', (req, res) => {
    res.send('App is running...')
})

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Listening at Port ${port}...`))