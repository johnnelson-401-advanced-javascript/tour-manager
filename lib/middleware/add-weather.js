const getForecast = require('../services/weather-api');

module.exports = () => (req, res, next) => {
  const { location } = req.body;
  
  if(!location) {
    return next({
      statusCode: 400,
      error: 'Weather Forecast requires Location'
    });
  }

  getForecast(location.latitude, location.longitude)
    .then(weather => {
      if(!weather) {
        throw {
          statusCode: 400,
          error: 'forecast not found'
        };
      }

      req.body.weather = weather;
      next();
    })
    .catch(next);
};