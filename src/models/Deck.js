import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import Match from './Match';

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const deckSchema = new Schema({
  generalId: Number,
  user_id: ObjectId,
  name: String,
  cards: [Number],
  deckString: String,
  deckHash: { type: String, index: true },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
}, {
  timestamps: true,
});

// Middleware
deckSchema.plugin(mongoosePaginate);

deckSchema.post('remove', async (doc, next) => {
  await Match.remove({ deck_id: doc._id });
  next();
});

module.exports = mongoose.model('Deck', deckSchema);
