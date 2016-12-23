import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const matchSchema = new Schema({
  _id: { type: String, index: true },
  deck_id: ObjectId,
  opponentUsername: String,
  opponentGeneralId: Number,
  opponentFactionId: Number,
  isDraw: Boolean,
  isWinner: Boolean,
  isPlayerOne: Boolean,
  startTime: Number,
  endTime: Number,
  generalId: Number,
  factionId: Number,
  rankBefore: Number,
  rankDelta: Number,
  rankStarsBefore: Number,
  rankStarsDelta: Number,
}, {
  timestamps: true,
});

matchSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Match', matchSchema);
