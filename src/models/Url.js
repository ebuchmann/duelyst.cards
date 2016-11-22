import mongoose from 'mongoose'

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const urlSchema = new Schema({
  _id: { type: String, index: true },
  hash: String,
  'created_at': { type: Date, default: Date.now },
})

module.exports = mongoose.model('Url', urlSchema);
