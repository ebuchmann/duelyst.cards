import mongoose from 'mongoose';
import { isEmail } from 'validator';

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
  username: String,
  password: String,
  apiKey: String,
  email: { type: String, validate: [ isEmail, 'invalid email' ] },
  viewAds: { type: Boolean, default: false },
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
