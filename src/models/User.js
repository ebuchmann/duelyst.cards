import mongoose from 'mongoose'

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
  username: String,
  password: String,
  apiKey: String,
  twitter: String,
  email: String,
  viewAds: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema);
