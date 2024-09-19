const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const calculateDegradationSchema = new Schema({

  experimentId: { type: String, required: true },
  a: { type: Number, required: true },
  b: { type: Number, required: true },
  t0: { type: Date, required: true },
  t1: { type: Date, required: true }

  // returns: result: {c0: Number, c1: Number, deltaC: Number, deltaR: Number, deltaT: Number, resultC: Number, resultR: Number}

}, { timestamps: true });

const CalculateDegradation = mongoose.model('degradationResult', calculateDegradationSchema);
module.exports = CalculateDegradation;
