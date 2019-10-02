/* eslint-disable new-cap */
const router = require('express').Router();
const Stop = require('../models/stop');
const addGeo = require('../middleware/add-geolocation');
const Tour = require('../models/tour');

router
  .get('/', (req, res, next) => {
    Stop.find()
      .lean()
      .then(stops => res.json(stops))
      .catch(next);
  })
  .post('/:id/stops', addGeo(), (req, res, next) => {
    Stop.create(req.body)
      .then(stop => { 
        Tour.findByIdAndUpdate(req.params.id,
          { $push: { stops: stop._id } },
          { new: true } 
        )
          .then(res => {
          });
        res.json(stop);
      })
      .catch(next);
      
  })
  .put('/:id', addGeo(), (req, res, next) => {
    Stop.updateById(req.body);
    req.params.id,
    req.body
      .then(stop => res.json(stop))
      .catch(next);
  })
  .post('/:id/tours', (req, res, next)=> {
    Stop.updateById(
      req.params.id,
      {
        $push: { stops: req.body }
      }
    )
      .then(show => res.json(show))
      .catch(next);
  })
  .delete('/tours/:id/stops/:stopId', ({ params }, res, next) => {
    Stop.removeShow(params.id, params.showId)
      .then(tours => res.json(tours))
      .catch(next);
  })

  .put('/:id/tours/:tourId', ({ params, body }, res, next) =>{
    Stop.addStop(params.id, body)
      .then(stops => res.json(stops))
      .catch(next);
  })

  .delete('/tours/:id/stops/:stopId/attendance', (req, res, next) => {
    Stop.findById(req.params.id)
      .populate()
      .then(stop => res.json(stop))
      .catch(next);
  });
module.exports = router;
