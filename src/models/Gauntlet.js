import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const gauntletSchema = new Schema({
  matches: [{
    _id: { type: String, index: true },
    opponentUsername: String,
    opponentGeneralId: Number,
    isDraw: Boolean,
    isWinner: Boolean,
    isPlayerOne: Boolean,
    startTime: Number,
    endTime: Number,
  }],
  generalId: Number,
  deck: [Number],
  isActive: Boolean,
  user: ObjectId,
  gold: { type: Number, default: null },
  spirit: { type: Number, default: null },
}, {
  timestamps: true,
});

gauntletSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Gauntlet', gauntletSchema);
