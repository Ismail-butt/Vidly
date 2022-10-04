const {Rental, validate} = require('../models/rentalModel'); 
const {Movie} = require('../models/movieModel'); 
const {Customer} = require('../models/cutomerModel');
const Fawn = require('fawn')
const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();

// Fawn.init(mongoose)

// Transaction
// A group of operations that should be performed as a unit. So, either all these operation will complete and change the state of the database or if any of the operation fails, we will roll back and database will go back to initial state.
// In MongoDb, we don't have Transaction.
// There is a technique that is Two phase Commits through which we can implement Transaction but it is - Advanced Topic
// NPM Package Fawn that will simulate Transaction in Mongoose.

router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send('Invalid customer.');

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid movie.');

  if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');

  let rental = new Rental({ 
    customer: {
      _id: customer._id,
      name: customer.name, 
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });

  // Transaction Starts Here

//   try {
//     new Fawn.Task()
//         .save('rentals', rental) // Chain All the task here
//         .update('movies', { _id: movie._id}, {
//             $inc: { numberInStock: -1 }
//         })
//         .run() // run will run All the task.
//         .catch(function(err){
//             // Everything has been rolled back.
            
//             // log the error which caused the failure
//             console.log(err);
//         });

//         console.log("Rental: ", rental)

//         res.send(rental);
//   } catch (err) {
//     // 500 - Internal Server Error
//     res.status(500).send('Something failed.')
//   }

  rental = await rental.save();

  movie.numberInStock--;
  movie.save();
  res.send(rental);
  
});

router.get('/:id', async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental) return res.status(404).send('The rental with the given ID was not found.');

  res.send(rental);
});

module.exports = router; 