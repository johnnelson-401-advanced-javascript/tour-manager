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

  .put('/tours/:id/stops/:stopId/attendance', ({ params, body }, res, next) =>{
    console.log(params);
    Stop.findByIdAndUpdate(params.stopId, body)
      .then(stops => {
        return res.json(stops);
      })
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Stop.findByIdAndRemove(req.params.id)
      .then(stop => res.json(stop))
      .catch(next);
  });
module.exports = router;
