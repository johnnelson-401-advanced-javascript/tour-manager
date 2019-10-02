const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString, RequiredDate } = require('./required-types');
const { ObjectId } = Schema.Types;

const schema = new Schema({
  title: RequiredString,
  activities: [{
    type: String,
  }],
  launchDate: RequiredDate,
  stops: {
    type: ObjectId,
    ref: 'Stop'
  }
});

module.exports = mongoose.model('Tour', schema);