const auth = require('../middleware/auth');
const { Rental, validate } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer')

const Fawn = require('fawn');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
Fawn.init(mongoose)

router.get('/', async (req, res, next) => {
   const rentals = await Rental
   .find()
   .sort('-dateOut');
   res.send(rentals);

});

router.post('/', auth, async (req, res, next) => {
   const { error } = validate(req.body);
   if (error) return res.status(400).send(error.details[0].message);

   const customer = await Customer.findById(req.body.customerId);
   if (!customer) return res.status(404).send('Invalid customer.');

   const movie = await Movie.findById(req.body.movieId);
   if (!movie) return res.status(404).send('Invalid movie.');

   if (movie.numberInStock === 0) return res.status(400).send('movie not in stock');

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

   new Fawn.Task()
      .save('rentals', rental)
      .update('movies', { _id: movie._id }, {
         $inc: { numberInStock: -1 }
      })
      .run()
   res.send(rental);

});

// router.put('/:id', auth, async (req, res) => {

//    const { error } = validate(req.body);
//    if (error) return res.status(400).send(error.details[0].message);

//    const customer = await Customer.findById(req.body.customerId);
//    if (!customer) return res.status(404).send('Invalid customer.');

//    const movie = await Movie.findById(req.body.movieId);
//    if (!movie) return res.status(404).send('Invalid movie.');

//    const Rental = await Rental.findByIdAndUpdate(req.params.id,
//       {
//          customer: {
//             _id: req.customer._id,
//             name: req.customer.name,
//             phone: req.customer.phone
//          },
//          movie: {
//             _id: req.movie._id,
//             title: req.movie.title,
//             dailyRentalRate: req.movie.dailyRentalRate
//          }

//       }, { new: true });

//    res.send(customer);
// });

router.get('/:id', async (req, res, next) => {
   const rental = await Rental.findById(req.params.rentalId);

   if (!rental) return res.status(404).send('No rental of this Id has been found.');

   res.send(rental);

});

module.exports = router; 