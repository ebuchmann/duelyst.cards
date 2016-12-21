import argon2 from 'argon2';
import { User } from '../models';
import { generateApiKey } from '../utils/apiKey';

generateApiKey()

const router = require('koa-router')();

router.get('/api/users', async function (ctx, next) {

});

router.post('/api/users/new', async (ctx, next) => {
  const { username, password, email } = ctx.request.body;

  // Username or password is already in use
  if (await User.findOne({ $or: [ { username }, { email } ] })) {
    ctx.status = 409;
    return;
  }

  const passHash = await argon2.hash(password, await argon2.generateSalt(32));
  const newUser = await new User({ username, password: passHash, email, apiKey: generateApiKey() }).save();
  delete newUser.password;

  ctx.body = newUser;
  ctx.status = 201;
});

module.exports = router;