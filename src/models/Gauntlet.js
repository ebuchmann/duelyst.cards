import mongoose from 'mongoose'

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
  deck: Array,
  isActive: Boolean,
  user: ObjectId,
})

module.exports = mongoose.model('Gauntlet', gauntletSchema);
