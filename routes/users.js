const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const { User, validate } = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


router.get('/', auth, async (req, res, nex) => {
   const users = await User.find()
      .sort('-isAdmin')
      .select({ name: 1, email: 1, _id: false, isAdmin: 1 });
   res.send(users);

})

router.get('/me', auth, async (req, res, nex) => {
   const user = await User.findById(req.user._id)
   .sort('-isAdmin')
   .select({ name: 1, email: 1, _id: false, isAdmin: 1 });
   res.send(user);

})

router.post('/', async (req, res, next) => {
   const { error } = validate(req.body);
   if (error) return res.status(400).send(error.details[0].message);

   let user = await User.findOne({ email: req.body.email });
   if (user) return res.status(400).send('User already registered.');

   user = new User(_.pick(req.body, ['name', 'email', 'password']));

   const salt = await bcrypt.genSalt(10);
   user.password = await bcrypt.hash(user.password, salt);
   await user.save();

   const token = user.generateAuthToken();
   res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email'])
   );

});
router.put('/:id', validateObjectId, async (req, res, next) => {
   const { error } = validate(req.body);
   if (error) return res.status(400).send(error.details[0].message);


   const user = await User.findById({ _id: req.params.id });
   if (!user) return res.status(400).send('User not found');

   user = await User.findByIdAndUpdate({ _id: req.params.id },
      _.pick(req.body, ['name', 'email', 'password'])
      , { new: true });
   res.send(_.pick(user, ['name', 'email']));

});
router.delete('/:id', validateObjectId, async (req, res, next) => {

   user = await User.findByIdAndRemove(req.params.id);
   if (!user) return res.status(404).send('user has already been deleted');
   res.send(_.pick(user, ['name', 'email']));
});

module.exports = router; 