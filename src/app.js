import Koa from 'koa';
import config from 'config'
import path from 'path'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()
const db = require('./db')()
const PORT = 3000
import { encode, decode } from './utils/encoding.js'
import cors from 'kcors'
import atob from 'atob'
import passport from 'koa-passport';
import convert from 'koa-convert';
import session from 'koa-generic-session';

const app = new Koa();

import { Url, Counter } from './models';

// Redirect anything to the regular site
router.get('/', function (ctx) {
  ctx.redirect(`${config.siteUrl}`);
});

// Redirects to the site
router.get('/:id', async function (ctx) {
  const url = await Url.findById(decode(ctx.params.id))

  url && url.hash
    ? ctx.redirect(`${config.siteUrl}/${url.hash}`)
    : ctx.redirect(`${config.siteUrl}`)
  ctx.status = 301
});

// Verify the hash follows the format (1-3):(any numbers)
function verifyHash (hash) {
  const reg = /^([1-3]:\d+(,|$))+?$/g
  return !reg.test(atob(hash))
}

// Accepts a hash and saves it to the DB
router.post('/api/save-deck', async function (ctx, next) {
  const hash = ctx.request.body.hash;

  if (typeof hash !== 'string' || hash.length < 1 || hash[0] !== '#' || verifyHash(hash)) {
    ctx.status = 422
    ctx.body = 'Invalid hash'
    return;
  }

  let id = null;

  // Try to find an existing hash instead of making a new entry
  const existingId = await Url.findOne({ hash })

  if (existingId) {
    id = encode(existingId._id)
  } else {
    // Get a new ID number
    const counter = await Counter.findByIdAndUpdate({ _id: 'url_count' }, { $inc: { seq: 1 } }, { new: true });

    // Encode the ID and save it along with the hash
    await new Url({ _id: counter.seq, hash }).save()
    id = encode(counter.seq);
  }

  ctx.body = { id }
});

// Sessions
app.keys = ['my-cat-meows-a-lot'];
app.use(convert(session()));

// Body Parser
app.use(convert(bodyParser()));

// Cors
app.use(convert(cors()));
// app.use(cors({ origin: config.siteUrl }));

// Authentication
require('./auth');
app.use(convert(passport.initialize()));
app.use(convert(passport.session()));

// Sets up routes
['gauntlet', 'auth', 'users'].forEach((route) => {
  app.use(require(`./routes/${route}`).routes());
});

app.use(router.routes());
app.use(router.allowedMethods());

(async () => {
  await app.listen(PORT);
  console.log(`App started, listening on port ${PORT}`);
})();