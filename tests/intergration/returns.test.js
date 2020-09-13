const moment = require('moment');
const request = require('supertest');
const { Rental } = require('../../models/rental');
const { User } = require('../../models/user');
const { Movie } = require('../../models/movie');
const mongoose = require('mongoose');

describe('/api/returns', () => {
   let server;
   let customerId;
   let movieId;
   let rental;
   let movie;
   let token;

   function exec() {
      return request(server)
         .post('/api/returns')
         .set('x-auth-token', token)
         .send({ movieId, movieId });

   }

   beforeEach(async () => {
      server = require('../../index');

      customerId = new mongoose.Types.ObjectId();
      movieId = new mongoose.Types.ObjectId();

      token = new User().generateAuthToken();

      movie = new Movie({
         _id: movieId,
         title: '12345',
         dailyRentalRate: 2,
         genre: { name: '12345' },
         numberInStock: 10

      });
      await movie.save();

      rental = new Rental({
         customer: {
            _id: customerId,
            name: '12345',
            phone: '12345'
         },
         movie: {
            _id: movieId,
            title: '12345',
            dailyRentalRate: 2
         }
      });
      await rental.save();
   });
   afterEach(async () => {
      await server.close();
      await Rental.remove({});
      await Movie.remove({});

   });

   it('Return 401 if client is not logged in ', async () => {
      token = '';

      const res = await exec();

      expect(res.body).not.toHaveProperty('token');

   });

   it('should return 400 if customer Id is not provided ', async () => {
      customerId = '';

      const res = await exec();


      expect(res.status).toBe(400);
   })

   it('should return 400 if movie Id is not provided ', async () => {
      movieId = '';

      const res = await exec();

      expect(res.status).toBe(400);
   })

   it('should return 404 if no rental found for the customer/movie combination ', async () => {
      await Rental.remove({});

      res = await exec();

      expect(res.status).toBe(400);
   })


   it('should return 400 if rental has already been processed. ', async () => {
      rental.dateReturned = new Date();
      await rental.save();

      const res = await exec();

      expect(res.status).toBe(400);
   });

   it('should return 200 if request is valid. ', async () => {

      const res = await exec();

      expect(res.status).toBeDefined();
   });

   it('should set the returned date if input is valid. ', async () => {
      await exec();

      const rentalInDB = await Rental.findById(rental._id);
      const diff = new Date() - rentalInDB.dateReturned;
      expect(diff).toBeDefined();
   });

   // it('should set the rental fee if input is valid. (numberOfDays * movie.dailyRentalRate). ', async () => {
   //    rental.dateOut = moment().add(-7, "days").toDate();
   //    await rental.save();

   //    await exec();

   //    const rentalInDB = await Rental.findById(rental._id);
   //    expect(rentalInDB.rentalFee).toBeTruthy();
   // });

   // it('should increase the movie stock for the movie . ', async () => {
   //    const res = await exec();

   //    const movieInDB = await Movie.findById(movieId);
   //    expect(movieInDB.numberInStock).toBe(movie.numberInStock + 1);


   // });
   // it('should return the rental if input is valid. ', async () => {
   //    const res = await exec();

   //    const rentalInDB = await Rental.findById(rental._id);
   //    expect(Object.keys(res.body))
   //       .toEqual(expect.arrayContaining(
   //          ['dateReturned', 'rentalFee', 'customer', 'movie']
   //       ));

   // });

});