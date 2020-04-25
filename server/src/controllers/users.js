const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/users');
const RefreshToken = require('../models/refreshTokens');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_PLUS_ID);

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
        expiresIn: '30d'
    });
};

module.exports = {
    signUp: async  (req, res, next) => {
        const { username, email, password } = req.value.body;

        const foundUserEmail = await User.findOne({ 'local.email': email });
        const foundUserUsername = await User.findOne({ 'local.username': username });

        if (foundUserUsername) { 
            res.json({ 
                success: 0,
                msg: 'Login jest już zajęty'
            });
        } 

        if (foundUserEmail) { 
            res.json({ 
                success: 0,
                msg: 'Email jest już zajęty' 
            });
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

        res.status(200).json({
            success: 1,
            msg: 'Pomyślnie zarejestrowano'
        });
    },

    signIn: async  (req, res, next) => {

        const token = signToken(req.user._id);
        const refToken = refreshToken(req.user._id);

        const newRefreshToken = new RefreshToken({ token: refToken });
        await newRefreshToken.save();

        res.status(200).json({
            success: 1,
            token,
            refToken,
            msg: 'Zalogowano'
        });
    },

    googleOAuth: async (req, res, next) => {

        async function verify() {
            try {
                const ticket = await client.verifyIdToken({
                    idToken: req.body.idtoken,
                    audience: process.env.GOOGLE_PLUS_ID
                });
                const payload = ticket.getPayload();
                const userid = payload['sub'];
                
                if (!payload.email_verified) {
                    return res.json({
                        success: 0,
                        msg: 'Niezweryfikowany email'
                });
                }
    
                const existingUser = await User.findOne({ 'google.id': userid });
                let token = null;
                let refToken = null;
                
                if (!existingUser) {
                    const newUser = new User({
                        method: 'google',
                        google: {
                            id: userid,
                            username: payload.name
                        }
                    });

                    await newUser.save();
    
                    token = signToken(newUser._id);
                    refToken = refreshToken(newUser._id);
                } else {
                    token = signToken(existingUser._id);
                    refToken = refreshToken(existingUser._id);
                }
    
                return res.json({
                    success: 1,
                    msg: 'Zalogowano',
                    token,
                    refToken
                });
            } catch (err) {
                return res.json({
                    success: 0,
                    msg: err
                });
            }
        }
        verify().catch(console.error);
    },

    signOut: async (req, res, next) => {
        const refToken = req.body.token;

        const isSignIn = await RefreshToken.findOne({ token: refToken });
        if (!isSignIn) {
           res.json({ message: 'Already logged out' });
        };


        await RefreshToken.deleteOne({ token: refToken });
        res.json({ success: 1 });
    },

    changePassword: async (req, res, next) => {
        if(!req.header('authorization')){
            res.json({ success: 0 });
        }

        jwt.verify(req.header('authorization'), process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                res.json({ success: -1 });
            } else {
                req.userId = decodedToken.sub;

                User.find({ '_id': req.userId }, async (err, user) => {
                    if (user[0].method != 'google') {
                        const salt = await bcrypt.genSalt(10);
                        const newPassword = await bcrypt.hash(req.body.password, salt);

                        User.updateOne(
                            { '_id': req.userId },
                            { local: {
                                username: user[0].local.username,
                                email: user[0].local.email,
                                password: newPassword
                                }
                            }
                        , (err) => {
                            if (err) {
                                res.json({ err })
                            } else {
                                res.json({ 
                                    success: 1,
                                    msg: 'Pomyślnie zmieniono hasło'
                                })
                            }
                        });
                    } else { res.json({
                                success: 0,
                                msg: 'Konto nie jest lokalne'
                                })
                            }
                });
            }
        });
    },

    getNewToken: async (req, res, next) => {
        const isValid = RefreshToken.findOne({ token: req.query.token });

        console.log(req.query)

        if (!isValid) {
            res.json({ success: 0 });
        }

        jwt.verify(req.query.token, process.env.JWT_REFRESH_SECRET, (err, decodedToken) => {
            if (err) {
                res.json({ success: -1 });
            }
            req.userId = decodedToken.sub;
        });

        const token = signToken(req.userId);
        res.status(200).json({ token });
    },

    checkUserRefToken: async (req, res, next) => {
    
        if(!req.body.token){
            res.json({ success: 0 });
        }

        const isValid = await RefreshToken.findOne({ token: req.body.token });

        if (!isValid) {
            res.json({ success: 0 });
        }

        jwt.verify(req.body.token, process.env.JWT_REFRESH_SECRET, (err) => {
            if (err) {
                res.json({ success: 0 });
            }
            res.json({ success: 1 });
        });
    },

    checkAccount: async (req, res, next) => {
        if(!req.query.token){
            res.json({ success: 0 });
        }

        jwt.verify(req.query.token, process.env.JWT_REFRESH_SECRET, (err, decodedToken) => {
            if (err) {
                res.json({ success: 0 });
            } else {
                req.userId = decodedToken.sub;

                User.find({ '_id': req.userId }, (err, user) => {
                    res.json({
                        success: 1,
                        account: user[0].method
                    });
                });
            }
        });
    },

    secret: async (req, res, next) => {
        res.status(200).json({
            success: 1,
            msg: 'Sekret'
        });
    }
};
