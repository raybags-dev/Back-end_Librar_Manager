const validateObjectId = require('../middleware/validateObjectId');
const _ = require('lodash');
const auth = require('../middleware/auth');
const { Customer, validate } = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => {
  const customers = await Customer.find().sort('name');
  res.send(customers);

});

router.post('/', auth, async (req, res, next) => {
  
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let customer = new Customer(_.pick(req.body, ['name', 'isGold', 'phone']));
  customer = await customer.save();

  res.send(_.pick(customer, ['name', 'phone']));


});

router.put('/:id', auth, async (req, res, next) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(req.params.id,
    {
      name: req.body.name,
      isGold: req.body.isGold,
      phone: req.body.phone
    }, { new: true });

  if (!customer) return res.status(404).send('The customer with the given ID was not found.');
  res.send(customer);

});

router.delete('/:id',validateObjectId, auth, async (req, res, next) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer) return res.status(404).send('The customer with the given ID was not found.');

  res.send(customer);
});

router.get('/:id', validateObjectId, async (req, res, next) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) return res.status(404).send('The customer with the given ID was not found.');

  res.send(customer);

});

module.exports = router; 