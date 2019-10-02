
const mongoId = /^[a-f\d]{24}$/i;

const matchMongoId = {
  _id: expect.stringMatching(mongoId)
};

const mongoDate = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(\\.[0-9]+)?(Z)?/i;
const matchMongoDate = {
  launchDate: expect.stringMatching(mongoDate)
};
const matchWeatherDate = {
  time: expect.stringMatching(mongoDate)
};
module.exports = {
  mongoId,
  matchMongoId,
  mongoDate,
  matchMongoDate,
  matchWeatherDate

};