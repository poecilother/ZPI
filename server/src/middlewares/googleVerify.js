const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_PLUS_ID);

module.exports = {
    googleVerify: async function() {
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
                msg: 'Zły token'
            });
        }
    }
}