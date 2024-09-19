const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deviceSchema = new Schema({

  ip: { type: String, required: true },
  mac: { type: String },
  name: { type: String, required: true },
  description: {type: String}

}, { timestamps: true });

const Device = mongoose.model('device', deviceSchema);
module.exports = Device;