import argon2 from 'argon2';
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

/**
 * Handles authenticating a user (logging in calls this)
 */

const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username }).select('_id username password email apiKey');

    if (!user) done(null, false);

    const match = await argon2.verify(user.password, password);

    if (user && match) {
      const newUser = user.toObject();
      delete newUser.password;
      done(null, newUser);
    } else {
      done(null, false);
    }
  } catch (error) {
    done(error);
  }
}));

/**
 * Authentication middleware
 */
export const isAuthenticated = async function(ctx, next) {
  if (!ctx.isAuthenticated()) { return ctx.status = 403; }
  return await next();
};
