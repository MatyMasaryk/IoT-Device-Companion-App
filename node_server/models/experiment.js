const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const experimentSchema = new Schema({

  deviceId: { type: String, required: true },
  deviceIp: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  procedureId: { type: String },
  startedAt: { type: Date },
  endedAt: { type: Date },
  currentInstructionIndex: { type: Number },
  currentInstructionStart: { type: Date },
  degradationResult: {type: String}

}, { timestamps: true });

const Experiment = mongoose.model('experiment', experimentSchema);
module.exports = Experiment;
