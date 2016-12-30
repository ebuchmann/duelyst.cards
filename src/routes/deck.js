import isequal from 'lodash.isequal';
import md5 from 'md5';
import { Deck, Match, User } from '../models';
import { mapId, remapGenerals, cleanMatch } from '../utils/cleanDeck';
import { isAuthenticated } from '../auth';

const router = require('koa-router')();

// Returns an array of gauntlets based on username
router.get('/api/decks/:username', async function(ctx, next) {
  const user = await User.findOne({ username: ctx.params.username });

  if (!user) {
    ctx.body = [];
    return;
  }

  const decks = await Deck.find({ user_id: user._id }).sort({ updatedAt: -1 }).select('-cards -deckHash');

  ctx.body = decks;
  ctx.status = 200;
});

// Returns a single deck run based on the deck id
router.get('/api/deck/:id', async function(ctx, next) {
  try {
    const deck = await Deck.findById(ctx.params.id);
    if (!deck) throw new Error('No deck found');

    ctx.body = deck
    ctx.status = 200;
  } catch (error) {
    ctx.status = 404;
  }
});

/**
 * Grabs match stats for a specific deck
 */
router.get('/api/deck/:id/stats', async function(ctx, next) {
  const matches = await Match.find({ deck_id: ctx.params.id });

  const stats = {
    argeon: { id: 1, faction: 'lyonar', wins: 0, losses: 0 },
    ziran: { id: 23, faction: 'lyonar', wins: 0, losses: 0 },
    kaleos: { id: 101, faction: 'songhai', wins: 0, losses: 0 },
    reva: { id: 123, faction: 'songhai', wins: 0, losses: 0 },
    zirix: { id: 201, faction: 'vetruvian', wins: 0, losses: 0 },
    sajj: { id: 223, faction: 'vetruvian', wins: 0, losses: 0 },
    lilithe: { id: 301, faction: 'abyssian', wins: 0, losses: 0 },
    cassyva: { id: 323, faction: 'abyssian', wins: 0, losses: 0 },
    vaath: { id: 401, faction: 'magmar', wins: 0, losses: 0 },
    starhorn: { id: 418, faction: 'magmar', wins: 0, losses: 0 },
    faie: { id: 501, faction: 'vanar', wins: 0, losses: 0 },
    kara: { id: 527, faction: 'vanar', wins: 0, losses: 0 },
  };

  matches.forEach(match => {
    let general = '';

    switch(match.opponentGeneralId) {
      case 1: general = 'argeon'; break;
      case 23: general = 'ziran'; break;
      case 101: general = 'kaleos'; break;
      case 123: general = 'reva'; break;
      case 201: general = 'zirix'; break;
      case 223: general = 'sajj'; break;
      case 301: general = 'lilithe'; break;
      case 323: general = 'cassyva'; break;
      case 401: general = 'vaath'; break;
      case 418: general = 'starhorn'; break;
      case 501: general = 'faie'; break;
      case 527: general = 'kara'; break;
    }

    if (match.isWinner && !match.isDraw) stats[general].wins = stats[general].wins + 1;
    else if (!match.isWinner && !match.isDraw) stats[general].losses = stats[general].losses + 1;
  });

  for (let value in stats) {
    if (stats[value].losses === 0 && stats[value].wins === 0) {
      // stats[value].winPer = 0;
      // stats[value].lossPer = 0;
      delete stats[value]
    } else {
      stats[value].winPer = Number(((stats[value].wins / (stats[value].wins + stats[value].losses)) * 100).toFixed(2));
      stats[value].lossPer = Number(((stats[value].losses / (stats[value].wins + stats[value].losses)) * 100).toFixed(2));
    }
  }

  ctx.body = stats;
  ctx.status = 200;
})

/**
 * Accepts match data, and either creates a new deck or match
 */
router.post('/api/save-match', async function (ctx, next) {
  const body = ctx.request.body;

  const user = await User.findOne({ apiKey: body.apiKey });

  if (!user) {
    ctx.body = 'User not found';
    return;
  }

  const cleanedDeck = body.cards.map(cardId => mapId(cardId));
  const deckHash = md5(cleanedDeck.sort().toString());
  let matchingDeck = await Deck.findOne({ user_id: user._id, deckHash });

  if (!matchingDeck) {
    matchingDeck = await new Deck({
      user_id: user._id,
      generalId: mapId(body.generalId),
      deckHash,
      cards: cleanedDeck
    }).save();
  }

  // Adds a new match
  if (!await Match.findById({ _id: body._id })) {
    await new Match({
      _id: body._id,
      deck_id: matchingDeck._id,
      opponentUsername: body.opponentUsername,
      opponentGeneralId: mapId(body.opponentGeneralId),
      opponentFactionId: body.opponentFactionId,
      isDraw: body.isDraw,
      isWinner: body.isWinner,
      isPlayerOne: body.isPlayerOne,
      startTime: body.startTime,
      endTime: body.endTime,
      generalId: body.generalId, // not needed?
      factionId: body.factionId,
      rankBefore: body.rankBefore,
      rankDelta: body.rankDelta,
      rankStarsBefore: body.rankStarsBefore,
      rankStarsDelta: body.rankStarsDelta,
    }).save();

    if (body.isWinner === 'true' && body.isDraw === 'false') {
      await Deck.findByIdAndUpdate({ _id: matchingDeck._id }, { $inc: { wins: 1 } });
    } else if (body.isWinner === 'false' && body.isDraw === 'false') {
      await Deck.findByIdAndUpdate({ _id: matchingDeck._id }, { $inc: { losses: 1 } });
    }
  }

  ctx.body = 'Update successful';
  ctx.status = 200;
});

/**
 * Deletes a deck and associated matches
 */
router.delete('/api/deck/:deckId', isAuthenticated, async (ctx, next) => {
  const { user } = ctx.state.user;
  const deck = await Deck.findOne({ _id: ctx.params.deckId, user_id: user._id });

  if (!deck) throw new Error('Deck not found');

  await deck.remove();

  ctx.status = 200;
});


module.exports = router;