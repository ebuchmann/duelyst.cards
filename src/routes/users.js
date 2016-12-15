import { User } from '../models';

const router = require('koa-router')();

router.get('/api/users', async function (ctx, next) {

});

router.post('/api/users/new', async (ctx, next) => {
  const { username, password, email } = ctx.request.body;

  if (await User.findOne({ $or: [ { username }, { email } ] })) {
    ctx.status = 409;
    return;
  }

  const newUser = await new User({ username, password, email }).save();
  delete newUser.password;

  ctx.body = newUser;
  ctx.status = 201;
});

module.exports = router;