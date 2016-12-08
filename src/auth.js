import co from 'co';
const passport = require('koa-passport');

// Returns a sample user, would actually fetch a user from the database
const fetchUser = async () => {
  const user = { id: 1, username: 'test', password: 'test' };
  return user;
};

passport.serializeUser((user, done) => {
  console.log('serializeUser', user)
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log('deserializeUser', id);
  try {
    done(null, await fetchUser());
  } catch (error) {
    done(error);
  }
});

const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy((username, password, done) => {
  console.log('doing local strat')
  return co(function* () {
    try {
      const user = yield fetchUser(); // or just make a db call based on username / password

      if (username === user.username && password === user.password) {
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (error) {
      done(error);
    }
  });
}));
