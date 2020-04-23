const jwt = require('jsonwebtoken');
const User = require('../models/users');
const RefreshToken = require('../models/refreshTokens');

signToken = userId => {
    return jwt.sign({
        sub: userId
    }, process.env.JWT_SECRET, {
        expiresIn: '2m'
    });
};

refreshToken = userId => {
    return jwt.sign({
        sub: userId
    }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '5h'
    });
};

module.exports = {
    signUp: async  (req, res, next) => {
        const { username, email, password } = req.value.body;

        const foundUserEmail = await User.findOne({ 'local.email': email });
        const foundUserUsername = await User.findOne({ 'local.username': username });
        
        if (foundUserEmail || foundUserUsername) { 
            return res.status(403).json({ error: 'Email or username is already in use' });
        } 

        const newUser = new User({ 
            method: 'local',
            local: {
                username: username, 
                email: email, 
                password: password
            } 
        });
        await newUser.save();

        const token = signToken(newUser._id);
        const refToken = refreshToken(newUser._id);

        const newRefreshToken = new RefreshToken({ token: refToken });
        await newRefreshToken.save();

        res.status(200).json({
            token,
            refToken
        });
    },

    signIn: async  (req, res, next) => {
        const token = signToken(req.user._id);
        const refToken = refreshToken(req.user._id);

        const newRefreshToken = new RefreshToken({ token: refToken });
        await newRefreshToken.save();

        res.status(200).json({
            token,
            refToken
        });
        console.log('signIn');
    },

    googleOAuth: async (req, res, next) => {
        const token = signToken(req.user._id);
        const refToken = refreshToken(req.user._id);

        const newRefreshToken = new RefreshToken({ token: refToken });
        await newRefreshToken.save();

        res.status(200).json({
            token,
            refToken
        });
    },

    signOut: async (req, res, next) => {
        const refToken = req.body.token;

        const isSignIn = await RefreshToken.findOne({ token: refToken });
        if (!isSignIn) {
           return res.json({ message: 'Already logged out' });
        };


        await RefreshToken.deleteOne({ token: refToken });
        return res.json({ success: 1 });
    },

    getNewToken: async (req, res, next) => {
        const isValid = RefreshToken.findOne({ token: req.body.token });

        if (!isValid) {
            return res.json({ success: 0 });
        }

        jwt.verify(req.body.token, process.env.JWT_REFRESH_SECRET, (err, decodedToken) => {
            if (err) {
                return res.json({ success: 0 });
            }
            req.userId = decodedToken.id;
        });

        const token = signToken(req.userId);
        res.status(200).json({ token });
    }
};
