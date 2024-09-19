const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const measurementSchema = new Schema({

  deviceIp: { type: String, required: true },
  experimentId: { type: String, required: true },
  humidity: { type: Number },
  temperature: { type: Number },
  vocIndex: { type: Number },
  noxIndex: { type: Number },
  rawVocTicks: { type: Number },
  rawNoxTicks: { type: Number }

}, { timestamps: true });

const Measurement = mongoose.model('measurement', measurementSchema);
module.exports = Measurement;
