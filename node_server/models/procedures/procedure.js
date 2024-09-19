const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const procedureSchema = new Schema({

  name: { type: String, required: true },
  description: { type: String },
  instructions: { type: Array }

}, { timestamps: true });

/* INSTRUCTIONS:
{ type: "measurementCycle", delay: Number, duration: Number },
{ type: "relaySwitch", relayId: String, status: String },
{ type: "pause", duration: Number }
*/

const Procedure = mongoose.model('procedure', procedureSchema);
module.exports = Procedure;
