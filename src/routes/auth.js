import passport from 'koa-passport';
const router = require('koa-router')();

router.post('/api/login', async (ctx, _next) => {
  return passport.authenticate('local', (err, user, info, status) => {
    if (user === false) {
      ctx.body = { success: false };
      ctx.throw(401);
    } else {
      ctx.body = { user };
      return ctx.login(user);
    }
  })(ctx, _next);
});

router.get('/api/logout', async (ctx, _next) => {
  ctx.logout();
  ctx.status = 200;
})

router.get('/api/get-account', async (ctx, _next) => {
  if (!ctx.isAuthenticated()) {
    ctx.body = null;
    return;
  }

  ctx.body = ctx.state.user;
  console.log(ctx.state.user)
  ctx.status = 200;
});

router.get('/am-i-authenticated', async (ctx, _next) => {
  ctx.body = ctx.isAuthenticated();
  ctx.status = 200;
});

module.exports = router;
