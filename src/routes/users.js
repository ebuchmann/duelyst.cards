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

router.post('/api/users/reset-api-key', async (ctx, next) => {
  if (!ctx.isAuthenticated()) {
    ctx.status = 401;
    return;
  }
  
  const { user } = ctx.state.user;
  const apiKey = generateApiKey()

  await User.findByIdAndUpdate({ _id: user._id }, { apiKey });

  ctx.body = apiKey;
  ctx.status = 200;
})

module.exports = router;