import isequal from 'lodash.isequal';
import { Gauntlet, User } from '../models';
import { mapId, remapGenrals } from '../utils/cleanDeck';

const router = require('koa-router')();

// Returns an array of gauntlets based on username
router.get('/api/gauntlets/:username', async function(ctx, next) {
  const user = await User.findOne({ username: ctx.params.username });

  if (!user) {
    ctx.body = [];
    return;
  }

  const gauntlets = await Gauntlet.find({ user: user._id }).sort({ isActive: -1, updatedAt: -1 });

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
  const allGauntlets = await Gauntlet.find({ user: ctx.params.id });

  if (!allGauntlets.length) return;

  const stats = {
    allWins: 0,
    allLosses: 0,
    winsAsPlayerOne: 0,
    winsAsPlayerTwo: 0,
    lossesAsPlayerOne: 0,
    lossesAsPlayerTwo: 0,
  };

  allGauntlets.forEach((gauntlet) => {
    gauntlet.matches.forEach((match) => {
      if (match.isWinner) stats.allWins = stats.allWins + 1;
      if (!match.isWinner && !match.isDraw) stats.allLosses = stats.allLosses + 1;
      if (match.isWinner && match.isPlayerOne) stats.winsAsPlayerOne = stats.winsAsPlayerOne + 1;
      if (match.isWinner && !match.isPlayerOne) stats.winsAsPlayerTwo = stats.winsAsPlayerTwo + 1; 
      if (!match.isWinner && !match.isDraw && match.isPlayerOne) stats.lossesAsPlayerOne = stats.lossesAsPlayerOne + 1;
      if (!match.isWinner && !match.isDraw && !match.isPlayerOne) stats.lossesAsPlayerTwo = stats.lossesAsPlayerTwo + 1;
    });
  });

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

  if (currentRun) {
    if (isequal(currentRun.deck.sort(), cleanedDeck.sort())) {
      const matchingId = currentRun.matches.find(match => match._id === body.match._id);

      if (!matchingId) {
        currentRun.matches.push(body.match);

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
      matches: [body.match],
      generalId: remapGenrals(body.generalId),
      deck: cleanedDeck,
      isActive: true,
    }).save();
    ctx.body = 'New run created';
  }

  console.log(ctx.body);
  ctx.status = 200;
});

module.exports = router;