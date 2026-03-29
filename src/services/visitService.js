const VisitCounter = require("../models/VisitCounter.js");

const getVisitCount = async () => {
  let counter = await VisitCounter.findOne();
  if (!counter) {
    counter = new VisitCounter({ count: 0 });
    await counter.save();
  }
  return counter.count;
};

const incrementVisitCount = async () => {
  let counter = await VisitCounter.findOne();
  if (!counter) {
    counter = new VisitCounter({ count: 1 });
  } else {
    counter.count += 1;
    counter.lastUpdated = Date.now();
  }
  await counter.save();
  return counter.count;
};

module.exports = {
  getVisitCount,
  incrementVisitCount,
};