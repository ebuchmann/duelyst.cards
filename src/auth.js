import co from 'co';
import { User } from './models';

const passport = require('koa-passport');

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    done(null, { user: await User.findById(id).select('_id username email apiKey') });
  } catch (error) {
    done(error);
  }
});

const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy((username, password, done) => {
  return co(function* () {
    try {
      const user = yield User.findOne({ username, password }).select('_id username email apiKey');

      user ? done(null, user) : done(null, false);
    } catch (error) {
      done(error);
    }
  });
}));
