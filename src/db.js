import config from 'config'
import mongoose from 'mongoose'

module.exports = function db() {
  mongoose.connect(config.mongodb.string)
  const connection = mongoose.connection

  mongoose.Promise = global.Promise
  // assert.equal(query.exec().constructor, global.Promise)

  connection.on('connected', () => {
    console.log('database connected');
  });

  return connection
}

