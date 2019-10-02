/* eslint-disable new-cap */
const router = require('express').Router();
const Stop = require('../models/stop');
const addGeo = require('../middleware/add-geolocation');

router
  .post('/', addGeo(), (req, res, next) => {
    Stop.create(req.body)
      .then(stop => res.json(stop))
      .catch(next);
  })
  .put('/:id', addGeo(), (req, res, next) => {
    Stop.updateById(req.body)
    req.params.id,
    req.body
      .then(stop => res.json(stop))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Stop.find()
      .lean()
      .then(stops => res.json(stops))
      .catch(next);
  })
  .post('/:id/stops', (req, res, next)=> {
    Stop.updateById(
      req.params.id,
      {
        $push: { shows: req.body }
      }
    )
      .then(show => res.json(show))
      .catch(next);
  // })

  // .get('/:id', (req, res, next) => {
  //   Stop.findById(req.params.id)
  //     .populate()
  //     .then(stop => res.json(stop))
  //     .catch(next);
  });
module.exports = router;
