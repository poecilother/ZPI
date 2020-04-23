const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token');
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

passport.use('googleToken', new GooglePlusTokenStrategy({
    clientID: process.env.GOOGLE_PLUS_ID,
    clientSecret: process.env.GOOGLE_PLUS_SECRET
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const existingUser = await User.findOne({ 'google.id': profile.id });

        if (existingUser) {
            console.log('User already exist');
            return done(null, existingUser);
        }

        const newUser = new User({
            method: 'google',
            google: {
                id: profile.id,
                username: profile.displayName
            }
        });

        await newUser.save();
        done(null, newUser);
    } catch (error) {
        done(error, false, error.message);
    };
}));

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await User.findOne({ 'local.username': username });

        if (!user) {
            return done(null, false);
        }
    
        const isMatch = await user.isValidPassword(password);   
    
        if (!isMatch) {
            return done(null, false);
        }
    
        done(null, user);

    } catch (error) {
        done(error, false);
    }    
}));
