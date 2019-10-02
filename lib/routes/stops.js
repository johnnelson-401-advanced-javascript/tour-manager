/* eslint-disable new-cap */
const router = require('express').Router();
const Stop = require('../models/stop');

router
  .post('/', (req, res, next) => {
    Stop.create(req.body)
      .then(stop => res.json(stop))
      .catch(next);
  })
  .post('/tours/:id/stops', (req, res, next) => {
    Stop.create(req.body)
      .then(stop => res.json(stop))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Stop.find()
      .then(stops => res.json(stops))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Stop.findById(req.params.id)
      .populate()
      .then(stop => res.json(stop))
      .catch(next);
  });
module.exports = router;
