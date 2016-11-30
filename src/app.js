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

const app = new Koa()

const Url = require(path.join(__dirname, 'models', 'Url.js'));
const Counter = require(path.join(__dirname, 'models', 'Counter.js'));

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

function verifyHash (hash) {
  // Verify the hash follows the format (1-3):(any numbers)
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

app.use(bodyParser());
app.use(cors({ origin: config.siteUrl }));
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(PORT, function () { console.log(`Listening on port: ${PORT}`); });