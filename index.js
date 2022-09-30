const express = require('express')

const genreRoutes = require('./routes/genreRoutes')

const app = express()

app.use(express.json())

app.use('/api/genres', genreRoutes)

app.get('/', (req, res) => {
    res.send('App is running...')
})

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Listening at Port ${port}...`))