const request = require('../request');
const db = require('../db');
const { matchMongoId, mongoDate } = require('../match-helpers');
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
  const tour1 = {
    title: 'Cats on Ice',
    activities: ['cats', 'ice', 'first-aid'],
    launchDate: Date.now()
  };
  function postTour(tour) {
    return request
      .post('/api/tours')
      .send(tour)
      .expect(200)
      .then(({ body }) => body);
  }

  function postStop(stop, tourId) {
    return request
      .post(`/api/stops/${tourId}/stops`)
      .send(stop)
      .expect(200)
      .then(({ body }) => body);
  }

  it('adds a stop with geolocation to a tour', () => {
    return postTour(tour1).then(tour => {
      return postStop(stop1, tour._id).then(body => {
        
        expect(body.weather.time).toMatch(mongoDate);

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
  function deleteStop(stopId) {
    return request
      .delete(`/api/stops/${stopId}`)
      .expect(200)
      .then(({ body }) => body);
  }
  it('deletes a stop', () => {
    return postTour(tour1).then(tour => {
      return postStop(stop1, tour._id).then(stop => {
        return deleteStop(stop._id)
          .then(res => {
            console.log(stop);
            expect(res).toEqual(stop);
          });
      });    
    });
  });

  
  it('updates attendance at a stop', () => {
    
    const stopAttendance = { attendance: 42 };

    return postTour(tour1).then(tour => {
      return postStop(stop1, tour._id).then(stop =>{
        return request 
          .put(`/api/stops/tours/${tour._id}/stops/${stop._id}/attendance`)
          .send(stopAttendance)
          .expect(200)
          .then(({ body }) => body);
      });
    });
  });
});
