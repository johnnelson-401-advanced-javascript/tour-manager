const request = require('../request');
const db = require('../db');
const { matchMongoId, matchMongoDate } = require('../match-helpers');

describe('tests tours api routes', () => {
  beforeEach(() => {
    return db.dropCollection('tours');
  });

  const tour = {
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
  it('posts a tour', () => {
    return postTour(tour).then(tour => {
      expect(tour).toEqual({
        _id: expect.any(String),
        __v: 0,
        ...tour
      });
    });
  });
  it('gets a tour by id', () => {
    return postTour(tour).then(tour => {
      return request
        .get(`/api/tours/${tour._id}`)
        .expect(200)
        .then(({ body }) => {
          expect(body.launchDate).toMatch(
            /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(\\.[0-9]+)?(Z)?/i
          );
          expect(body).toMatchInlineSnapshot(
            { ...matchMongoId, ...matchMongoDate },

            `
            Object {
              "__v": 0,
              "_id": StringMatching /\\^\\[a-f\\\\d\\]\\{24\\}\\$/i,
              "activities": Array [
                "cats",
                "ice",
                "first-aid",
              ],
              "launchDate": StringMatching /\\^\\(-\\?\\(\\?:\\[1-9\\]\\[0-9\\]\\*\\)\\?\\[0-9\\]\\{4\\}\\)-\\(1\\[0-2\\]\\|0\\[1-9\\]\\)-\\(3\\[01\\]\\|0\\[1-9\\]\\|\\[12\\]\\[0-9\\]\\)T\\(2\\[0-3\\]\\|\\[01\\]\\[0-9\\]\\):\\(\\[0-5\\]\\[0-9\\]\\):\\(\\[0-5\\]\\[0-9\\]\\)\\(\\\\\\\\\\.\\[0-9\\]\\+\\)\\?\\(Z\\)\\?/i,
              "title": "Cats on Ice",
            }
          `
          );
        });
    });
  });
});
