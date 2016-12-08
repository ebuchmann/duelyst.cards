import isequal from 'lodash.isequal';
import { Gauntlet, User } from '../models';

const router = require('koa-router')();


router.post('/api/save-gauntlet', async function (ctx, next) {
  console.log('Receiving data...');
  const body = ctx.request.body;

  const user = await User.findOne({ apiKey: body.apiKey });

  if (!user) {
    ctx.body = 'User not found';
    return;
  }

  console.log(user);

  let createNewRun = true;
  const currentRun = await Gauntlet.findOne({ user: user._id, isActive: true });

  if (currentRun) {
    if (isequal(currentRun.deck.sort(), body.deck.sort())) {
      const matchingId = currentRun.matches.find(match => match._id === body.match._id);

      if (!matchingId) {
        currentRun.matches.push(body.match);
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
      generalId: body.generalId,
      deck: body.deck,
      isActive: true,
    }).save();
    ctx.body = 'New run created';
  }

  ctx.status = 200;
});

module.exports = router;