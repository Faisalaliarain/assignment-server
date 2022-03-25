const mongoose = require('mongoose');
const config = require('../config/serverConfig')
module.exports = function databaseConnection (callback) {

  mongoose.connect(config.mongoDBUri, {useNewUrlParser: true});
  const db = mongoose.connection;

  db.on('error', (error) => {
    callback(error);
  })
  .once('open', function() {
    callback(null);
  });

}
