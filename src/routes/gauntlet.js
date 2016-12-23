import isequal from 'lodash.isequal';
import { Gauntlet, User } from '../models';
import { mapId, remapGenerals, cleanMatch } from '../utils/cleanDeck';

const router = require('koa-router')();

// Returns an array of gauntlets based on username
router.get('/api/gauntlets/:username', async function(ctx, next) {
  const user = await User.findOne({ username: ctx.params.username });

  if (!user) {
    ctx.body = [];
    return;
  }

  const page = Number(ctx.query.page) || 1;
  const limit = Number(ctx.query.limit) || 5;

  const gauntlets = await Gauntlet.paginate({ user: user._id }, { sort: { isActive: -1, updatedAt: -1 }, page, limit });

  ctx.body = gauntlets;
  ctx.status = 200;
});

// Returns a single gauntlet run based on the gauntlet id
router.get('/api/gauntlet/:id', async function(ctx, next) {
  ctx.body = await Gauntlet.findById(ctx.params.id);
  ctx.status = 200;
});

// Returns stats for all gauntlet runs from a userId
router.get('/api/gauntlets/:id/stats', async function(ctx, next) {
  const user = await User.findOne({ username: ctx.params.id });
  if (!user) return;

  const allGauntlets = await Gauntlet.find({ user: user._id });

  if (!allGauntlets.length) return;

  const stats = {
    allWins: 0,
    allLosses: 0,
    allDraws: 0,
    winsAsPlayerOne: 0,
    winsAsPlayerTwo: 0,
    lossesAsPlayerOne: 0,
    lossesAsPlayerTwo: 0,
    totalMatches: 0,
    totalRuns: 0,
    winPercent: 0,
    totalGold: 0,
    totalSpirit: 0,
    averageWins: 0,
  };

  allGauntlets.forEach((gauntlet) => {
    stats.totalRuns = stats.totalRuns + 1;
    if (typeof gauntlet.gold === 'number') stats.totalGold = stats.totalGold + gauntlet.gold;
    if (typeof gauntlet.spirit === 'number') stats.totalSpirit = stats.totalSpirit + gauntlet.spirit;
    gauntlet.matches.forEach((match) => {
      stats.totalMatches = stats.totalMatches + 1;
      if (match.isWinner) stats.allWins = stats.allWins + 1;
      if (!match.isWinner && !match.isDraw) stats.allLosses = stats.allLosses + 1;
      if (!match.isWinner && match.isDraw) stats.allDraws = stats.allDraws + 1;
      if (match.isWinner && match.isPlayerOne) stats.winsAsPlayerOne = stats.winsAsPlayerOne + 1;
      if (match.isWinner && !match.isPlayerOne) stats.winsAsPlayerTwo = stats.winsAsPlayerTwo + 1; 
      if (!match.isWinner && !match.isDraw && match.isPlayerOne) stats.lossesAsPlayerOne = stats.lossesAsPlayerOne + 1;
      if (!match.isWinner && !match.isDraw && !match.isPlayerOne) stats.lossesAsPlayerTwo = stats.lossesAsPlayerTwo + 1;
    });

  });

  if (stats.totalRuns > 0 && stats.totalMatches > 0) {
    stats.winPercent = Number((stats.allWins / stats.totalMatches * 100).toFixed(2));
    stats.averageWins = Number((stats.allWins / stats.totalRuns).toFixed(2));
  }

  ctx.body = stats;
});

// Used to save a new match / create a new gauntlet run
router.post('/api/save-gauntlet', async function (ctx, next) {
  console.log('Receiving data...');
  const body = ctx.request.body;

  const user = await User.findOne({ apiKey: body.apiKey });

  if (!user) {
    ctx.body = 'User not found';
    return;
  }

  let createNewRun = true;
  const currentRun = await Gauntlet.findOne({ user: user._id, isActive: true });
  const cleanedDeck = body.deck.map(cardId => mapId(cardId));
  const cleanedMatch = cleanMatch(body.match);

  if (currentRun) {
    if (isequal(currentRun.deck.sort(), cleanedDeck.sort())) {
      const matchingId = currentRun.matches.find(match => match._id === cleanedMatch._id);

      if (!matchingId) {
        currentRun.matches.push(cleanedMatch);

        // checks if the gauntlet run is over
        if (currentRun.matches.filter(match => match.isWinner).length === 12 ||
            currentRun.matches.filter(match => !match.isWinner && !match.isDraw).length === 3) {
              currentRun.isActive = false;
            }

        await currentRun.save();
        ctx.body = 'New match added';
      } else {
        ctx.body = 'Nothing updated';
      }
      createNewRun = false;
    } else {
      // Newest run doesn't match the existing opened run, close it and create a new run
      currentRun.isActive = false;
      await currentRun.save();
    }
  }

  if (createNewRun) {
    await new Gauntlet({
      user: user._id,
      matches: [cleanedMatch],
      generalId: remapGenerals(body.generalId),
      deck: cleanedDeck,
      isActive: true,
    }).save();
    ctx.body = 'New run created';
  }

  console.log(ctx.body);
  ctx.status = 200;
});

module.exports = router;