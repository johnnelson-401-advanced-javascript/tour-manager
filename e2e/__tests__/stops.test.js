const request = require('../request');
const db = require('../db');
const {
  matchMongoId,
  matchMongoDate,
  matchWeatherDate,
  mongoDate
} = require('../match-helpers');
//Live API testing
const getLocation = require('../../lib/services/maps-api');
//mock API
jest.mock('../../lib/services/maps-api');

getLocation.mockResolvedValue({
  latitude: 45.5266975,
  longitude: -122.6880503
});

describe('tests stops and addGeo() functionality', () => {
  beforeEach(() => {
    return db.dropCollection('tours');
  });
  const stop1 = {
    name: 'cats on ice',
    address: '97209',
    location: {},
    weather: {
      time: Date.now(),
      forecast: 'There will be Ice'
    },
    attendance: 3
  };

  function postStop(stop) {
    return request
      .post('/api/stops')
      .send(stop)
      .expect(200)
      .then(({ body }) => body);
  }

  it('adds a stop with geolocation to a tour', () => {
    return postStop(stop1).then(body => {
      expect(body.weather.time).toMatch(mongoDate);
      console.log(body.weather.time);
      expect(body).toMatchInlineSnapshot(
        {
          ...matchMongoId,
          weather: {
            forecast: expect.any(String),
            time: expect.stringMatching(mongoDate)
          }
        },

        `
        Object {
          "__v": 0,
          "_id": StringMatching /\\^\\[a-f\\\\d\\]\\{24\\}\\$/i,
          "address": "97209",
          "attendance": 3,
          "location": Object {
            "latitude": 45.5266975,
            "longitude": -122.6880503,
          },
          "name": "cats on ice",
          "weather": Object {
            "forecast": Any<String>,
            "time": StringMatching /\\^\\(-\\?\\(\\?:\\[1-9\\]\\[0-9\\]\\*\\)\\?\\[0-9\\]\\{4\\}\\)-\\(1\\[0-2\\]\\|0\\[1-9\\]\\)-\\(3\\[01\\]\\|0\\[1-9\\]\\|\\[12\\]\\[0-9\\]\\)T\\(2\\[0-3\\]\\|\\[01\\]\\[0-9\\]\\):\\(\\[0-5\\]\\[0-9\\]\\):\\(\\[0-5\\]\\[0-9\\]\\)\\(\\\\\\\\\\.\\[0-9\\]\\+\\)\\?\\(Z\\)\\?/i,
          },
        }
      `
      );
    });
  });
});
// +   "__v": 0,
// +   "_id": "5d94dc8a65e23b35f7f6c876",
// +   "address": "97209",
// +   "attendance": 3,
// +   "location": Object {
// +     "latitude": 45.5266975,
// +     "longitude": -122.6880503,
// +   },
// +   "name": "cats on ice",
// +   "weather": Object {
// +     "forecast": "There will be Ice",
// +     "time": "2019-10-02T17:21:14.966Z",
// +   },
// + }
