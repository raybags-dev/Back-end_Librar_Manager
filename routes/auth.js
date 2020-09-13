const Joi = require('joi');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const validate = require('../middleware/validate');
const { User } = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.post('/', validate(validateAuth), async (req, res, next) => {

   let user = await User.findOne({ email: req.body.email });
   if (!user) return res.status(400).send('invalid email or passoword.');

   const validPassword = await bcrypt.compare(req.body.password, user.password);
   if (!validPassword) res.status(400).send('invalid password or email')

   const token = user.generateAuthToken();
   res.send(token);
});

function validateAuth(req) {
   const Schema = {
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().required()
   }
   return Joi.validate(req, Schema);
}

module.exports = router; 