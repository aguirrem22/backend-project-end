const mongoose = require("mongoose");

const visitCounterSchema = new mongoose.Schema({
  count: {
    type: Number,
    default: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const VisitCounter = mongoose.model("VisitCounter", visitCounterSchema);

module.exports = VisitCounter;