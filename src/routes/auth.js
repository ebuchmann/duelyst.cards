import passport from 'koa-passport';
const router = require('koa-router')();

router.post('/', async (ctx, _next) => {
  console.log(ctx.request.body)
  return passport.authenticate('local', (err, user, info, status) => {
    console.log('user', user, info, status)
    if (user === false) {
      ctx.body = { success: false };
      ctx.throw(401);
    } else {
      ctx.body = { success: true };
      return ctx.login(user);
    }
  })(ctx, _next);
});

router.get('/am-i-authenticated', async (ctx, _next) => {
  ctx.body = ctx.isAuthenticated();
  ctx.status = 200;
});

module.exports = router;
