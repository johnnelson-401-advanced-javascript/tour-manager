const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString, RequiredDate } = require('./required-types');
// const { ObjectId } = Schema.Types;

const schema = new Schema({
  name: RequiredString,
  address: String,
  location: {
    latitude: Number,
    longitude: Number,
  },
  weather: {
    time: RequiredDate,
    forecast: RequiredString,
  },
  attendance: {
    type: Number,
    min: 1,
  }
});
module.exports = mongoose.model('Stop', schema);