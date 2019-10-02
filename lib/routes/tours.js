/* eslint-disable new-cap */
const router = require('express').Router();
const Tour = require('../models/tour');

router
  .post('/', (req, res, next) => {
    Tour.create(req.body)
      .then(tour => res.json(tour))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Tour.find()
      .then(tours => res.json(tours))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Tour.findById(req.params.id)
      .populate('stops', 'location weather attendance')
      .then(tour => res.json(tour))
      .catch(next);
  });
module.exports = router;