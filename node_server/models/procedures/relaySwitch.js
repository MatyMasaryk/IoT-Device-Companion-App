const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const relaySwitchSchema = new Schema({

  deviceIp: { type: String, required: true },
  relayId: { type: String, required: true },
  status: { type: String, required: true }

}, { timestamps: true });

const RelaySwitch = mongoose.model('relayswitch', relaySwitchSchema);
module.exports = RelaySwitch;
