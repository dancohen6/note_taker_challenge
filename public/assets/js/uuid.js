function generateRandomHexId() {
    // GENERATE RANDOM NUMBER //
    return Math.floor((1 + Math.random()) * 0x10000)
    // CONVERT TO HEXIDECIMAL AND REMOVE 0 //
      .toString(16)
      .substring(1);
  }
  
  module.exports = generateRandomHexId;
