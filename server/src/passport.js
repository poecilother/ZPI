const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/users');

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: process.env.JWT_SECRET
}, async (payload, done) => {
    try {
        const user = await User.findById(payload.sub);

        if (!user) {
            return done(null, false);
        }

        done(null, user);
        
    } catch(error) {
        done(error, false)
    }
}));

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await User.findOne({ 'local.username': username });

        if (!user) {
            return done(null, false, { message: 'Niepoprawny login lub hasło' });
        }
    
        const isMatch = await user.isValidPassword(password);   
    
        if (!isMatch) {
            return done(null, false, { message: 'Niepoprawny login lub hasło' });
        }
    
        done(null, user);

    } catch (error) {
        done(error, false);
    }    
}));
