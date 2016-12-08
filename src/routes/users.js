import { User } from '../models';

const router = require('koa-router')();

router.get('/api/user', async function (ctx, next) {

});

router.post('/auth/user/new', async (ctx, next) => {
  const { username, password } = ctx.request.body;

  if (await User.findOne({ username })) return;

  await new User({ username, password }).save();
});

module.exports = router;