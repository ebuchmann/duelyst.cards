import Koa from 'koa';
import config from 'config'
import path from 'path'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()
const db = require('./db')()
const PORT = 3000
import { encode, decode } from './utils/encoding.js'
import cors from 'kcors'

const app = new Koa()

const Url = require(path.join(__dirname, 'models', 'Url.js'));
const Counter = require(path.join(__dirname, 'models', 'Counter.js'));

router.get('/', async function (ctx, next) {
  const test = await Counter.findByIdAndUpdate({ _id: 'url_count'}, { $inc: { seq: 1 } }, { new: true });
  const url = new Url({ _id: test.seq, hash: Math.random() });
  await url.save()
});

// Redirects to the site
router.get('/:id', async function (ctx) {
  const url = await Url.findById(decode(ctx.params.id))

  url && url.hash
    ? ctx.redirect(`http://localhost:8080/${url.hash}`)
    : ctx.redirect(`http://localhost:8080/`)
  ctx.status = 301
});

// Accepts a hash and saves it to the DB
// TODO: verify hash is valid
router.post('/save-deck', async function (ctx, next) {
  const hash = ctx.request.body.hash;
  let id = null;

  // Try to find an existing hash instead of making a new entry
  const existingId = await Url.find({ hash })

  if (existingId.length) {
    id = encode(existingId[0]._id)
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
app.use(cors());
app.use(router.routes());
app.use(router.allowedMethods());


app.listen(PORT, function () { console.log(`Listening on port: ${PORT}`); });