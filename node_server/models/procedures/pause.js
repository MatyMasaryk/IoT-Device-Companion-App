const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pauseSchema = new Schema({

  deviceIp: { type: String, required: true },
  experimentId: { type: String, required: true },
  duration: { type: Number, required: true }

}, { timestamps: true });

const Pause = mongoose.model('pause', pauseSchema);
module.exports = Pause;
