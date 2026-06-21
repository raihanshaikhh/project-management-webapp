import dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.models.js";
import crypto from "crypto"
import { emailSend, welcomeEmailTemplate } from "./mail.js";
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // check if user already exists
                let user = await User.findOne({ email: profile.emails[0].value });

                if (user) {
                    // user exists — just return them
                    return done(null, user);
                }

                // new user — create account
                user = await User.create({
                    username: profile.displayName.replace(/\s+/g, "").toLowerCase() + Math.random().toString(36).slice(-4), // avoid username conflicts
                    email: profile.emails[0].value,
                    avatar: {
                        url: profile.photos[0]?.value ?? "https://placehold.co/200",
                        localPath: "",
                    },
                    isEmailVerified: true,
                    password: crypto.randomBytes(16).toString("hex"), // random unhashed — pre-save hook will hash it
                });
                emailSend({
                    email: user.email,
                    subject: "Welcome to Flow 🎉",
                    mailgenContent: welcomeEmailTemplate(user.username),
                }).catch((err) => {
                    console.error("Welcome email failed:", err.message);
                });
                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
export default passport;