
import dotenv from 'dotenv';
dotenv.config();
import express from 'express'
import cors from 'cors'
import authRoutes from './router/authRoutes.js'

import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const app =express()


app.use(cors())


app.use(express.json())


app.use(session({
  secret: process.env.SESSION_SECRET, 
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());




passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,  
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,  
    callbackURL:"http://localhost:3000/auth/google/callback"
  },
  (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});


app.use('/auth',authRoutes)


app.listen(process.env.PORT, () => {
  console.log('serve is running on port', process.env.PORT);
});