import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const deckSchema = new Schema({
  generalId: Number,
  user_id: ObjectId,
  name: String,
  cards: [Number],
  deckString: String,
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
}, {
  timestamps: true,
});

deckSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Deck', deckSchema);
