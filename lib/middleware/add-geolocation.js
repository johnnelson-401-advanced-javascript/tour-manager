const getLocation = require('../services/maps-api');

module.exports = () => (req, res, next) => {
  const { address } = req.body;
  
  if(!address) {
    return next({
      statusCode: 400,
      error: 'must enter an address'
    });
  }

  getLocation(address)
    .then(location => {
      if(!location) {
        throw {
          statusCode: 400,
          error: 'address not found'
        };
      }

      req.body.location = location;
      next();
    })
    .catch(next);
};