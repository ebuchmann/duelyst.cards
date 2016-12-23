import isequal from 'lodash.isequal';
import { Deck, Match, User } from '../models';
import { mapId, remapGenerals, cleanMatch } from '../utils/cleanDeck';

const router = require('koa-router')();

// Returns an array of gauntlets based on username
router.get('/api/decks/:username', async function(ctx, next) {
  const user = await User.findOne({ username: ctx.params.username });

  if (!user) {
    ctx.body = [];
    return;
  }

  const decks = await Deck.find({ user_id: user._id }).sort({ updatedAt: -1 }).select('-cards -deckString');

  ctx.body = decks;
  ctx.status = 200;
});

// Returns a single deck run based on the deck id
router.get('/api/deck/:id', async function(ctx, next) {
  ctx.body = await Deck.findById(ctx.params.id);
  ctx.status = 200;
});

/**
 * Grabs match stats for a specific deck
 */
router.get('/api/deck/:id/stats', async function(ctx, next) {
  const matches = await Match.find({ deck_id: ctx.params.id });

  const stats = {
    argeon: { wins: 0, losses: 0 },
    ziran: { wins: 0, losses: 0 },
    kaleos: { wins: 0, losses: 0 },
    reva: { wins: 0, losses: 0 },
    sajj: { wins: 0, losses: 0 },
    zirix: { wins: 0, losses: 0 },
    cassyva: { wins: 0, losses: 0 },
    lilithe: { wins: 0, losses: 0 },
    vaath: { wins: 0, losses: 0 },
    starhorn: { wins: 0, losses: 0 },
    faie: { wins: 0, losses: 0 },
    kara: { wins: 0, losses: 0 },
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
      stats[value].winPer = 0;
      stats[value].lossPer = 0;
    } else {
      stats[value].winPer = Number(((stats[value].wins / (stats[value].wins + stats[value].losses)) * 100).toFixed(2));
      stats[value].lossPer = Number(((stats[value].losses / (stats[value].wins + stats[value].losses)) * 100).toFixed(2));
    }
  }

  ctx.body = stats;
  ctx.status = 200;
})

// Used to save a new match / create a new gauntlet run
router.post('/api/save-match', async function (ctx, next) {
  console.log('Receiving match data...');
  const body = ctx.request.body;

  const user = await User.findOne({ apiKey: body.apiKey });

  if (!user) {
    ctx.body = 'User not found';
    return;
  }

  const cleanedDeck = body.cards.map(cardId => mapId(cardId));
  const deckString = cleanedDeck.sort().toString();
  let matchingDeck = await Deck.findOne({ deckString });

  if (!matchingDeck) {
    matchingDeck = await new Deck({
      user_id: user._id,
      generalId: mapId(body.generalId),
      deckString,
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
  }

  console.log(ctx.body);
  ctx.status = 200;
});

module.exports = router;